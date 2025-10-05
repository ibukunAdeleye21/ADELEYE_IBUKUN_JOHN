import { Request, Response } from "express";
import AppDataSource from "../config/data-source";

const getHealth = async (req: Request, res: Response) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.json({
      status: "OK",
      db: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      db: "Disconnected",
      message: (err as any).message,
    });
  }
};

export default {getHealth};