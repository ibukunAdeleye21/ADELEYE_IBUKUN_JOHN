import { CreateEmployeeDTO } from "../dtos/createEmployee.dto";
import logger from "../utils/logger";

const validateEmployee = (dto: CreateEmployeeDTO) => {
    logger.debug("Validating employee data");

    if (!dto.name || !dto.email || !dto.departmentId) {
        logger.warn(`Missing required fields: name, email, departmentId`);
        throw new Error("Missing required fields: name, email, departmentId");
    }

    dto.name = dto.name.trim();
    dto.email = dto.email.trim().toLowerCase();

    if (!dto.email.includes("@")) {
        logger.warn(`Invalid email addres: ${dto.email}`);
        throw new Error("Invalid email address");
    }

    return dto;
}

const validateEmployeeId = (id: string): number => {
    logger.debug("Validating employee ID");

    if (!id) {
        logger.warn(`Missing required id for employee`);
        throw new Error("Missing required field: id");
    }

    const employeeId = parseInt(id, 10);

    if (isNaN(employeeId) || employeeId <= 0) {
        logger.warn(`Invalid employee ID: ${id}`);
        throw new Error("Invalid employee ID. Must be a positive number.");
    }

    return employeeId;
}

export default {validateEmployee, validateEmployeeId};