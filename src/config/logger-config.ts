import { WinstonModuleOptions } from 'nest-winston/dist/winston.interfaces';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { format, transports } from 'winston';

const loggerConfig: WinstonModuleOptions = {
    exitOnError: false,
    transports: [
        new DailyRotateFile({
            filename: 'debug-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '7d',
            level: 'debug',
            format: format.combine(
                format.uncolorize(),
                format.timestamp(),
                format.printf(msg => {
                    return `${msg.timestamp} [${msg.level}] - ${msg.message}` + (msg.stack ? `\n\t${msg.stack}` : '');
                }),
            ),
            handleExceptions: true,
            handleRejections: true,
        }),
        new DailyRotateFile({
            filename: 'error-%DATE%.log',
            dirname: './logs',
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '7d',
            level: 'error',
            format: format.combine(
                format.uncolorize(),
                format.timestamp(),
                format.printf(msg => {
                    return `${msg.timestamp} [${msg.level}] - ${msg.message}` + (msg.stack ? `\n\t${msg.stack}` : '');
                }),
            ),
            handleExceptions: true,
            handleRejections: true,
        }),
        new transports.Console({
            handleExceptions: true,
            handleRejections: true,
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(msg => {
                    return `${msg.timestamp} [${msg.level}] - ${msg.message}` + (msg.stack ? `\n\t${msg.stack}` : '');
                }),
            ),
        }),
    ],
};

export default loggerConfig;
