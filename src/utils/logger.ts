import { createLogger, format, transports, Logger } from "winston";

const logger = createLogger({
    level: "debug", 
    format: format.combine(
        format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        format.printf(({level, message, timestamp}) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Logs to console
        new transports.File({filename: "logs/error.log", level: "error"}), // Logs errors to file
        new transports.File({ filename: "logs/combined.log"}) // Logs all levels to another file
    ],
});

export default logger;