import express from "express";
import employeeController from "../controllers/employee.controller";

const route = express.Router();

const {createEmployeeController, getEmployeeWithLeaveHistoryController} = employeeController;

route.post("/employees", createEmployeeController);
route.get("/employees", getEmployeeWithLeaveHistoryController);

export default route;