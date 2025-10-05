import AppDataSource from "../config/data-source";
import { LeaveRequest } from "../models/leaveRequest.model";
import logger from "../utils/logger";

const repo = AppDataSource.getRepository(LeaveRequest);

const createLeaveRequestRepo = async (leaveRequest: LeaveRequest) => {
    logger.debug("Saving leave request to DB");
    
    const saved = await repo.save(leaveRequest);
    logger.info(`LeaveRequest created successfully for employee ${leaveRequest.employee.id}`);
    
    return saved;
};

const getLeaveRequestRepo = async (id: number) => {
    logger.debug(`Fetch leave request with ID: ${id}`);

    // get department with paginated employees in one query
    const leaveRequest = await repo.findOne({
        where: {id: id}
    });

    return leaveRequest;
};



export default { createLeaveRequestRepo, getLeaveRequestRepo };  