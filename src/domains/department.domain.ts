import { CreateDepartmentDTO } from "../dtos/createDepartment.dto";
import { getDepartmentEmployeesDTO } from "../dtos/getDepartmentEmployees.dto";
import logger from "../utils/logger";


const validateDepartmentDTO = (dto: CreateDepartmentDTO) => {
    logger.debug("validating department name");

    if (!dto) {
        logger.warn("Body not provided");
        throw new Error("Please provide body");
    }

    if (!dto.name) {
        logger.warn("Department name not provided");
        throw new Error("Department name cannot be empty");
    }

    dto.name = dto.name.trim().toLowerCase();

    return dto;
}

const validatePaginationParams = (dto: getDepartmentEmployeesDTO) => {
    logger.debug("Validating pagination parameters and department ID");

    if (!dto.departmentId || dto.departmentId <= 0) {
        logger.warn(`Invalid department ID: ${dto.departmentId}`);
        throw new Error("Invalid department ID");
    }

    dto.page = dto.page && dto.page > 0 ? dto.page : 1;
    dto.limit = dto.limit &&  dto.limit > 0 && dto.limit <= 50 ? dto.limit : 10;

    return dto;
}

export default {validateDepartmentDTO, validatePaginationParams};