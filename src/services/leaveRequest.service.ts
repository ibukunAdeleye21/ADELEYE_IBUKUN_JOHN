import validateLeaveRequest from "../domains/leaveRequest.domain";
import mapToLeaveRequest from "../mappers/leaveRequest.mapper";
import leaveRequestRepository from "../repositories/leaveRequest.respoitory";
import employeeRepository from "../repositories/employee.repository";
import logger from "../utils/logger";
import { CreateLeaveRequestDTO } from "../dtos/createLeaveRequest.dto";

const {createLeaveRequestRepo} = leaveRequestRepository;
const {isIdExists} = employeeRepository;

// Optional: Simulated message queue publisher
// import { publishToQueue } from "../utils/queuePublisher";

const createLeaveRequest = async (dto: CreateLeaveRequestDTO) => {
    logger.debug("Processing new leave request");

    const validDto = validateLeaveRequest(dto);

    // Ensure employee exists
    const employee = await employeeRepository.isIdExists(validDto.employeeId);
    if (!employee) {
        logger.warn(`Employee with id: ${validDto.employeeId} not found`);
        throw new Error("Employee not found");
    }
    
    // Map DTO → Entity
    const leaveEntity = mapToLeaveRequest(validDto, employee);
    
    // Save in DB
    const savedLeave = await leaveRequestRepository.createLeaveRequestRepo(leaveEntity);
    
    // Publish to queue (for async notifications)
    // await publishToQueue("leave_requests", {
    //     id: savedLeave.id,
    //     employeeId: employee.id,
    //     status: savedLeave.status,
    //     createdAt: savedLeave.createdAt,
    // });

    logger.info(`Leave request created successfully for Employee ${employee.id}`);
    return savedLeave;
};

export default { createLeaveRequest };
