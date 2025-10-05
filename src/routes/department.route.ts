import express from "express";
import departmentController from "../controllers/department.controller";

const route = express.Router();
const {createDepartmentController, getDepartmentEmployeesController} = departmentController;

route.post("/departments", createDepartmentController);
route.get("/departments/:id/employees", getDepartmentEmployeesController)

export default route;