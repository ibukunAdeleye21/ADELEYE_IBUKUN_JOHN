import express from "express";
import leaveRequestController from "../controllers/leaveRequest.controller";

const route = express.Router();

route.post("/leave-requests", leaveRequestController.createLeaveRequestController);

export default route;