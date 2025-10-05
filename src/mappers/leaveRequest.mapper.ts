import { LeaveRequest, LeaveStatus } from "../models/leaveRequest.model";
import { CreateLeaveRequestDTO } from "../dtos/createLeaveRequest.dto";
import { Employee } from "../models/employee.model";

const mapToLeaveRequest = (dto: CreateLeaveRequestDTO, employee: Employee): LeaveRequest => {
    const leave = new LeaveRequest();
    leave.employee = employee;
    leave.startDate = dto.startDate;
    leave.endDate = dto.endDate;
    leave.status = LeaveStatus.PENDING; // Default status
    
    return leave;
};

export default mapToLeaveRequest;