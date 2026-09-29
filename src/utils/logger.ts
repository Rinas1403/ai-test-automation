import * as path from 'path';
import winston from 'winston';
import { env } from './env.config';

/**
 * Logger ghi ra file reports/logs/ — KHÔNG ghi ra console để report Allure
 * không bị kèm stdout. Mỗi worker parallel ghi file riêng, tránh ghi đè nhau.
 */
const workerIndex = process.env.TEST_WORKER_INDEX ?? 'main';

export const logger = winston.createLogger({
  level: env.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} [worker-${workerIndex}] ${level.toUpperCase()} ${message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, `../../reports/logs/worker-${workerIndex}.log`),
      // Chỉ tạo file khi có log thật — process chính của runner không sinh file rỗng
      lazy: true,
    }),
  ],
});
