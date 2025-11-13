import winston from 'winston';
import config from '../config';

const {logDir,isDev}=config;

const logFileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({ stack: true },));
const consoleLogFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `[${timestamp}] ${level}: ${message} - ${stack}`
            : `[${timestamp}] ${level}: ${message}`;
    }),
);
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
});

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' , format: logFileFormat ,dirname: logDir}),
        new winston.transports.File({ filename: 'combined.log', format: logFileFormat ,dirname: logDir}),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log',dirname: logDir })
    ],
});
if (isDev) {
    logger.add(new winston.transports.Console({
        format: consoleLogFormat,
    }));
    logger.level = 'debug';
}

export default logger;