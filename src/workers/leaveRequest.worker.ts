import amqp from "amqplib";
import { LeaveRequest, LeaveStatus } from "../models/leaveRequest.model";
import { ProcessedMessage } from "../models/processedMessage.model";
import AppDataSource from "../config/data-source";
import logger from "../utils/logger";
import createExponentialBackOffWithJitter from "../utils/retryStrategy";
import leaveRequestRespoitory from "../repositories/leaveRequest.respoitory";
import leaveRepo from "../repositories/leaveRequest.respoitory";
import processedMessageRepo from "../repositories/processedMessage.repository";

const retryStrategy = createExponentialBackOffWithJitter();
const {getLeaveRequestRepo, createLeaveRequestRepo} = leaveRequestRespoitory;
const {getProcessedMessageRepo, createProcessedMessageRepo} = processedMessageRepo;

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE = "leave.exchange";
const ROUTING_KEY = "leave.requested";

// mapping attempt => retry queue
const RETRY_QUEUES = ["leave.retry.1", "leave.retry.2", "leave.retry.3"];
const MAX_ATTEMPTS = RETRY_QUEUES.length; // 3

async function startWorkers() {
    logger.debug(`Start worker...`);

    // connect to RabbitMQ
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();

    // inside worker init:
    await channel.assertExchange(EXCHANGE, "direct", { durable: true });

    // main queue with DLX to leave.dead (for final dead-lettering)
    await channel.assertQueue("leave.requested.queue", {
        durable: true,
        arguments: { "x-dead-letter-exchange": "leave.dead.exchange" },
    });
    await channel.bindQueue("leave.requested.queue", EXCHANGE, ROUTING_KEY);

    // retry queues (each will dead-letter to the main exchange after TTL)
    await channel.assertQueue("leave.retry.1", {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": EXCHANGE,
            "x-dead-letter-routing-key": ROUTING_KEY,
            "x-message-ttl": 1000, // 1s
        },
    });
    await channel.assertQueue("leave.retry.2", {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": EXCHANGE,
            "x-dead-letter-routing-key": ROUTING_KEY,
            "x-message-ttl": 5000, // 5s
        },
    });
    await channel.assertQueue("leave.retry.3", {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": EXCHANGE,
            "x-dead-letter-routing-key": ROUTING_KEY,
            "x-message-ttl": 30000, // 30s
        },
    });

    // dead-letter queue/exchange
    await channel.assertExchange("leave.dead.exchange", "fanout", { durable: true });
    await channel.assertQueue("leave.dead", { durable: true });
    await channel.bindQueue("leave.dead", "leave.dead.exchange", "");

    // limit concurrent messages a worker handles at once
    channel.prefetch(1);

    // Ensure the queue exist
    // await channel.assertQueue(queue, { durable: true });
    // logger.info(`Worker listening on queue: ${queue}`);

    // consume messages
    channel.consume("leave.requested.queue", async (msg) => {
        if (!msg) {
            return;
        }

        const content = JSON.parse(msg.content.toString());
        const messageId = content.messageId;
        //const attempt = parseInt(msg.properties.headers?.["x-retry-count"] || "0") || 0;
        const attempt = (msg.properties.headers?.attempt ?? content.attempt) || 0;

        try {
            // Idempotency: skip if already processed
            const existingProcessedMessage = await getProcessedMessageRepo(messageId);
            if (existingProcessedMessage) {
                logger.info(`Skipping already processed message ID: ${messageId}`);
                channel.ack(msg)
                return;
            }

            // Load leave (ensure exists)
            const leaveRequest = await getLeaveRequestRepo(content.id);
            if (!leaveRequest) {
                logger.warn(`LeaveRequest ${content.id} not found`);
                throw new Error(`LeaveRequest ${content.id} not found`);
            }

            // Apply business rule: auto-approve short leaves <= 2 days
            const start = new Date(leaveRequest.startDate);
            const end = new Date(leaveRequest.endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            // update leave status
            leaveRequest.status = days <= 2 ? LeaveStatus.APPROVED : LeaveStatus.PENDING;

            // save the leaveRequest
            const savedLeaveRequest = await createLeaveRequestRepo(leaveRequest);
            logger.info(`Leave ${savedLeaveRequest.id} processed as ${savedLeaveRequest.status}`);

            // mark message as processed
            const savedProcessedMessage = await createProcessedMessageRepo(messageId);
            logger.info(`ProcessedMessage ${savedProcessedMessage.id} saved in the database`);

            // process the message
            // await processMessage(content);
            channel.ack(msg);
        } catch (error: any) {
            logger.error(`Processing failed (attempt ${attempt}) message ${messageId}: ${error.message}`);

            if (attempt >= MAX_ATTEMPTS) {
                logger.error(`Max attempts reached for ${messageId}. Sending to dead-letter queue.`);
                // send to dead queue (publish to dead exchange)
                channel.publish("leave.dead.exchange", "", Buffer.from(JSON.stringify(content)), { persistent: true });
                channel.ack(msg); // remove from main queue
            } else {
                // Send to next retry queue (which will requeue to main after TTL)
                const nextAttempt = attempt + 1;
                const retryQueue = RETRY_QUEUES[Math.min(attempt, RETRY_QUEUES.length - 1)]!;
                // Put attempt in headers so next time we see it we know which attempt
                channel.sendToQueue(retryQueue, Buffer.from(JSON.stringify(content)), {
                    persistent: true,
                    headers: { attempt: nextAttempt },
                });
                channel.ack(msg); // remove original (we requeued to retry)
                logger.info(`Requeued message ${messageId} to ${retryQueue} for attempt ${nextAttempt}`);
            }
        };
    }, { noAck: false});
}

startWorkers().catch((e) => logger.error("Worker crash: " + e.message));