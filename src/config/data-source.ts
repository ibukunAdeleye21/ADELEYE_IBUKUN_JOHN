import 'reflect-metadata';
import { DataSource } from "typeorm";
import { Employee } from "../models/employee.model";
import { Department } from "../models/department.model";
import { LeaveRequest } from '../models/leaveRequest.model';

// Database connection
// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: process.env.DB_HOST || "localhost",
//   port: Number(process.env.DB_PORT) || 3306,
//   username: process.env.DB_USERNAME || "root",
//   password: process.env.DB_PASSWORD || "password",
//   database: process.env.DB_NAME || "workforce_db",
//   entities: [Employee],
//   synchronize: false,   // we will use migrations instead
//   logging: true,
// });

const AppDataSource = new DataSource({
    type: "mysql",
    url: "mysql://root:ibukun2166@localhost:3306/workforce_management_system",
    synchronize: false,
    logging: true,
    entities: [Employee, Department, LeaveRequest],
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data source has been initialized");
    })
    .catch(err => {
        console.log("Data source initialization error", err);
    });

export default AppDataSource;