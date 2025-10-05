import {Employee} from "../models/employee.model";
import { CreateEmployeeDTO } from "../dtos/createEmployee.dto";
import logger from "../utils/logger";
import { Department } from "../models/department.model";

const mapToEmployee = (dto: CreateEmployeeDTO) => {
    logger.debug("Mapping to employee model");

    const employee = new Employee();
    employee.name = dto.name;
    employee.email = dto.email;
    
    const department = new Department;
    department.id = dto.departmentId;
    employee.department = department;

    return employee;
}

export default mapToEmployee;