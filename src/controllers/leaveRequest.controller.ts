import {Request, Response} from "express";
import leaveRequestService from "../services/leaveRequest.service";
import logger from "../utils/logger";
import responseWrapper from "../utils/responseWrapper";

const {successResponse, errorResponse} = responseWrapper;
const {createLeaveRequest} = leaveRequestService;

const createLeaveRequestController = async (req: Request, res: Response) => {
    try {
        logger.debug("Incoming request to create leave request");

        const dto = req.body;
        const leaveResponse = await createLeaveRequest(dto);

        return res.status(201).json(successResponse("Leave request created successfully", leaveResponse));

    } catch (error: any) {
        logger.error(`Error creating leave request: ${error.message}`);
        return res.status(400).json(errorResponse("Error creating leave request", error.message));
    }
}

export default {createLeaveRequestController};