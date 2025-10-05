// controllers/queueHealth.controller.ts
import amqp from "amqplib";
import { Request, Response } from "express";

const getQueueHealth = async (req: Request, res: Response) => {
  try {
    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createChannel();
    await ch.checkQueue("leave.requested.queue");
    await conn.close();

    res.json({
      status: "OK",
      queue: "leave.requested.queue",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: (err as any).message,
    });
  }
};

export default {getQueueHealth};
