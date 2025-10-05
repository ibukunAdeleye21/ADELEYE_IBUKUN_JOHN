import AppDataSource from "../config/data-source";
import { Department } from "../models/department.model";
import logger from "../utils/logger";

const repo = AppDataSource.getRepository(Department);

const createDepartmentRepo = async (data: Partial<Department>) => {
    logger.debug("Creating department in the db");

    const department = repo.create(data);
    const saved = await repo.save(department);

    logger.info(`Department '${department.name}' created successfully`);
    return saved;
}   

const getDepartmentWithEmployeesRepo = async (departmentId: number) => {
    logger.debug(`Fetching department ${departmentId} with employees`);

    // get department with paginated employees in one query
    const department = await repo.findOne({
        where: {id: departmentId},
        relations: ["employees"],
        order: {
            employees: {
                id: "ASC"
            },
        },
    });

    return department;
};

const isDepartmentExists = async (departmentId: number): Promise<boolean> => {
  logger.debug(`Checking if department ID ${departmentId} exists`);
  const department = await repo.findOne({ where: { id: departmentId } });
  return !!department; // true = exists, false = not found
};

export default {createDepartmentRepo, getDepartmentWithEmployeesRepo, isDepartmentExists};