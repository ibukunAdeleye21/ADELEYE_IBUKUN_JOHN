import AppDataSource from "../config/data-source";
import { ProcessedMessage } from "../models/processedMessage.model";
import logger from "../utils/logger";

const repo = AppDataSource.getRepository(ProcessedMessage);

const getProcessedMessageRepo = async (messageId: string) => {
    logger.debug(`Fetching processed message with ID: ${messageId}`);

    // get department with paginated employees in one query
    const processedMessageRepo = await repo.findOneBy({messageId});

    return processedMessageRepo;
};

const createProcessedMessageRepo = async (messageId: string) => {
    logger.debug(`Create processed message with ID: ${messageId} in the db`);
    
    const saved = await repo.save({messageId});
    logger.info(`Processed message created successfully`);
    
    return saved;
};

export default {getProcessedMessageRepo, createProcessedMessageRepo};