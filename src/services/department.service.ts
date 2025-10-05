import { create } from "domain";
import validate from "../domains/department.domain";
import mapToDepartment from "../mappers/department.mapper";
import departmentRepository from "../repositories/department.repository";
import logger from "../utils/logger";
import { CreateDepartmentDTO } from "../dtos/createDepartment.dto";
import { getDepartmentEmployeesDTO } from "../dtos/getDepartmentEmployees.dto";

const {validateDepartmentDTO, validatePaginationParams} = validate;
const {createDepartmentRepo, getDepartmentWithEmployeesRepo} = departmentRepository;

const createDepartment = async (dto: CreateDepartmentDTO) => {
    logger.debug("Incoming request to create a department");

    // transform the body
    const validDto = validateDepartmentDTO(dto);

    // map dto to entity
    const departmentEntity = mapToDepartment(validDto);

    // save in the db
    return await createDepartmentRepo(departmentEntity);
}

const getDepartmentEmployees = async (dto: getDepartmentEmployeesDTO) => {
    logger.debug(`Service: fetching department ${dto.departmentId} with employees`);

    const validDto = validatePaginationParams(dto);

    const department = await getDepartmentWithEmployeesRepo(validDto.departmentId);

    if (!department) {
        logger.warn(`Department with ID ${validDto.departmentId} not found`);
        throw new Error("Department not found");
    }

    const total = department.employees.length;
    const paginatedEmployees = department.employees.slice(
        (validDto.page - 1) * validDto.limit,
        validDto.page * validDto.limit
    );

    return {
        department: {
            id: department.id,
            name: department.name,
            createdAt: department.createdAt,
        },
        employees: paginatedEmployees,
        pagination: {
            total,
            page: validDto.page,
            limit: validDto.limit,
            totalPages: Math.ceil(total / validDto.limit),
        },
    };
}

export default {createDepartment, getDepartmentEmployees};