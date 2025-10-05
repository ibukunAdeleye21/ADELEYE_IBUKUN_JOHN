import logger from "../utils/logger";
import {Request, Response} from "express";
import departmentService from "../services/department.service";
import responseWrapper from "../utils/responseWrapper";

const {createDepartment, getDepartmentEmployees} = departmentService;
const {successResponse, errorResponse} = responseWrapper;

const createDepartmentController = async (req: Request, res: Response) => {
    try {
        logger.debug("Incoming request to create department");

        const dto = req.body;
        const department = await createDepartment(dto);

        return res.status(201).json(successResponse("Department created successfully", department));

    } catch (error: any) {
        logger.error(`Error creating department: ${error.message}`);

        return res.status(500).json(errorResponse("Error creating department", error.message));
    }
}

const getDepartmentEmployeesController = async (req: Request, res: Response) => {
    try {
        const dto = {
            departmentId: Number(req.params.id),
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
        }

        logger.debug(`Incoming request to get employees of a department with ID: ${dto.departmentId}`);

        const result = await getDepartmentEmployees(dto);

        return res.status(200).json(successResponse("Department employeed fetched successfully", result));

    } catch (error: any) {
        logger.error(`Error fetching department employees: ${error.message}`);

        return res.status(500).json(errorResponse("Error fetching department employees", error.message));
    }
}

export default {createDepartmentController, getDepartmentEmployeesController};