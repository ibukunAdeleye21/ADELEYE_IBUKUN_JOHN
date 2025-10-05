import logger from "../utils/logger";

export interface RetryStrategy {
    getDelay(attempt: number): number;
    maxRetries: number;
}

// export class ExponentialBackOffWithJitter implements RetryStrategy {
//     maxRetries = 5;
//     baseDelay = 1000 // 1 second

//     getDelay(attempt: number): number {
//         const exponential = this.baseDelay * Math.pow(2, attempt);
//         const jitter = Math.random() * 300; // adds 0-300ms 
//         const delay = exponential + jitter;
//         logger.debug(`Retrying in ${Math.round(delay)} ms`);
//         return delay;
//     }
// }

const createExponentialBackOffWithJitter = (
    baseDelay = 1000, // 1 second
    maxRetries = 5,
    jitterRange = 300
): RetryStrategy => {
    const getDelay = (attempt: number): number => {
        const exponential = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * jitterRange;
        const delay = exponential + jitter;
        logger.debug(`Retrying in ${Math.round(delay)} ms`);
        return delay;
    };

    return {getDelay, maxRetries};
};

export default createExponentialBackOffWithJitter;