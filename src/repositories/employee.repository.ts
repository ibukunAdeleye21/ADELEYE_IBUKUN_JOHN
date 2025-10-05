import AppDataSource from "../config/data-source";
import { Employee } from "../models/employee.model";
import logger from "../utils/logger";

const repo = AppDataSource.getRepository(Employee);

const createEmployeeRepo = async (employee: Employee) => {
    logger.debug(`Saving employee with email ${employee.email} to the database`);

    const saved = await repo.save(employee);
    logger.info(`Employee '${employee.name}' created successfully`);
    return saved;
}

const isEmailExists = async (email: string): Promise<boolean> => {
  logger.debug(`Checking if email ${email} already exists`);

  const existingEmployee = await repo.findOne({ where: { email } });
  return !!existingEmployee; // returns true if found, false otherwise
};

const isIdExists = async (id: number) => {
    logger.debug(`Checking if id ${id} exist`);

    const isEmployeeIdExists = await repo.findOne({ where: {id} });
    return isEmployeeIdExists;
}

const findEmployeeWithLeaveHistory = async (employeeId: number) => {
    logger.debug(`Fetching employee with Id: ${employeeId} and their leave history`);

    const employee = await repo.findOne({
        where: { id: employeeId },
        relations: ["department", "leaveRequests"], // load both relations
    });

    return employee;
}

export default { createEmployeeRepo, isEmailExists, findEmployeeWithLeaveHistory, isIdExists };