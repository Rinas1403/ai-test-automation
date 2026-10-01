import path from 'node:path';
import winston from 'winston';
import { env } from './env.config';

/**
 * Logger ghi ra file reports/logs/test-execution.log.
 * KHÔNG có console transport — output ra stdout sẽ bị Allure đính thành attachment "stdout" (cấm theo reporting_rules.md).
 */
export const logger = winston.createLogger({
  level: env.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} [worker ${process.env.TEST_WORKER_INDEX ?? '-'}] ${level.toUpperCase().padEnd(5)} ${message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../reports/logs/test-execution.log'),
    }),
  ],
});
