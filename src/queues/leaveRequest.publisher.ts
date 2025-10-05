import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE = "leave.exchange";
const ROUTING_KEY = "leave.requested";

export async function publishLeaveRequested(payload: any) {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();
    
    // ensure exchange exists
    await ch.assertExchange(EXCHANGE, "direct", { durable: true });
    
    const messageId = uuidv4();
    const msg = {
        ...payload,
        messageId,
        attempt: 0,
    };

    ch.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(msg)), {
        persistent: true, // make message survive broker restart
        messageId,
        headers: { attempt: 0 },
    });

    logger.info(`Published leave request message ${messageId}`);
    await ch.close();
    await conn.close();

    return messageId;
}