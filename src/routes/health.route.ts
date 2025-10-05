import express from "express";
import healthController from "../controllers/health.controller";
import queueHealthController from "../controllers/queueHealth.controller";

const router = express.Router();

const {getHealth} = healthController;
const {getQueueHealth} = queueHealthController;


router.get("/health", getHealth);
router.get("/queue-health", getQueueHealth);

export default router;