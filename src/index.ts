import express from 'express';
//import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import AppDataSource from "./config/data-source";
dotenv.config();

import departmentRoute from "./routes/department.route";
import employeeRoute from "./routes/employee.route";
import leaveRequestRoute from "./routes/leaveRequest.route";
import healthRoute from "./routes/health.route";


const app = express();

app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https:"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: false
    })
);

app.use("/api", departmentRoute);
app.use("/api", employeeRoute);
app.use("/api", leaveRequestRoute);
app.use("/api", healthRoute);

const PORT = process.env.PORT || 9000;

// connect DB
const connection = AppDataSource;

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
})
