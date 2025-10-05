
import { Department } from "../models/department.model";
import { CreateDepartmentDTO } from "../dtos/createDepartment.dto";
import logger from "../utils/logger";

const mapToDepartment = (dto: CreateDepartmentDTO): Department => {
    logger.debug("Mapping to leave request model")
  const dept = new Department();
  dept.name = dto.name;
  return dept;
}

export default mapToDepartment;