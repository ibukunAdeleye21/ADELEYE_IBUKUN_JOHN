import { CreateEmployeeDTO } from "../dtos/createEmployee.dto";
import logger from "../utils/logger";
import validate from "../domains/employee.domain";
import departmentRepository from "../repositories/department.repository";
import employeeRepository from "../repositories/employee.repository";
import mapToEmployee from "../mappers/employee.mapper";

const {isDepartmentExists} = departmentRepository;
const {isEmailExists, createEmployeeRepo, findEmployeeWithLeaveHistory} = employeeRepository;
const {validateEmployeeId, validateEmployee} = validate;

const createEmployee = async (dto: CreateEmployeeDTO) => {
    logger.debug(`Creating employee with email ${dto.email}`);

    const validDto = validateEmployee(dto);

    // check if department exists
    const departmentExists = await isDepartmentExists(validDto.departmentId);
    if (!departmentExists) {
        logger.warn(`Department with ID ${validDto.departmentId} not found`);
        throw new Error("Invalid department ID");
    }

    // check if email exists
    const emailExists = await isEmailExists(validDto.email);
    if (emailExists) {
        logger.warn(`Email ${validDto.email} already exists`);
        throw new Error("Email already registered. Please use another one.");
    }

    // Map employee 
    const employee = mapToEmployee(validDto);

    // save employee
    const savedEmployee = await createEmployeeRepo(employee);

    return savedEmployee;
}

const getEmployeeWithLeaveHistory = async (id: string) => {
    logger.debug(`Service: Getting employee with leave history`);

    const validEmployeeId = validateEmployeeId(id);

    const employee = await findEmployeeWithLeaveHistory(validEmployeeId);

    if (!employee) {
        logger.warn(`Employee with ID ${validEmployeeId} not found`);
        throw new Error("Employee not found");
    };

    return employee;
}

export default {createEmployee, getEmployeeWithLeaveHistory};