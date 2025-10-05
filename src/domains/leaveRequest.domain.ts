import { CreateLeaveRequestDTO } from "../dtos/createLeaveRequest.dto";
import logger from "../utils/logger";

const validateLeaveRequest = (dto: CreateLeaveRequestDTO) => {
    logger.debug("Validating leave request");

    if (!dto) {
        logger.warn("Leave request body not provided");
        throw new Error("Leave request body is required");
    }

    if (!dto.employeeId) {
        logger.warn("Employee ID not provided");
        throw new Error("Employee ID is required");
    }

    if (!dto.startDate || !dto.endDate) {
        logger.warn(`Start Date: ${dto.startDate} or End Date: ${dto.endDate} not provided`);
        throw new Error("Start and end dates are required");
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        logger.warn("Invalid date format");
        throw new Error("Invalid date format");
    }
    if (end <= start) {
        logger.warn("End date is the same as start date");
        throw new Error("End date must be after start date");
    }

    return dto;
}

export default validateLeaveRequest;