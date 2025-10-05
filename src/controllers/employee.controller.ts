import logger from "../utils/logger";
import {Request, Response} from "express";
import employeeService from "../services/employee.service";
import responseWrapper from "../utils/responseWrapper";

const {successResponse, errorResponse} = responseWrapper;

const {createEmployee, getEmployeeWithLeaveHistory} = employeeService;

const createEmployeeController = async (req: Request, res: Response) => {
    try {
        logger.debug("Incoming request to create employee");

        const dto = req.body;
        const employee = await createEmployee(dto);

        return res.status(201).json(successResponse("Employee created successfully", employee));

    } catch (error: any) {
        logger.error(`Error creating employee: ${error.message}`);

        return res.status(500).json(errorResponse("Error creating employee", error.message));
    }
}

const getEmployeeWithLeaveHistoryController = async (req: Request, res: Response) => {
    try {
        logger.debug("Incoming request to get employee with leave history");

        const id = req.params.id!;

        const employee = await getEmployeeWithLeaveHistory(id);

        return res.status(200).json(successResponse("Employee retrieved successfully", employee));

    } catch (error: any) {
        logger.error(`Error fetching employee: ${error.message}`);
        return res.status(404).json(errorResponse("Error fetching employee", error.message || "Failed to retrived employee"));
    }
}



export default {createEmployeeController, getEmployeeWithLeaveHistoryController};