import { LoggerOptions, transports, format, Logger, createLogger } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const logLevel = process.env.LOG_LEVEL;

const logDir = join(__dirname, '../../var/log');

if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
}

export const winstonConfig: LoggerOptions = {
    level: logLevel,
    format: format.combine(
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.File({
            filename: `${__dirname}/../../var/log/error.log`,
            level: 'error'
        }),
        new transports.File({
            filename: `${__dirname}/../../var/log/info.log`,
            level: 'info'
        }),
        new transports.File({
            filename: `${__dirname}/../../var/log/application.log`
        }),
        ...(isProduction
            ? []
            : [
                  new transports.Console({
                      format: format.combine(format.colorize(), format.cli())
                  })
              ])
    ]
};

const logger: Logger = createLogger(winstonConfig);

export default logger;
