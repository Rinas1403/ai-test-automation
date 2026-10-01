import * as dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function withDefault(key: string, fallback: string): string {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

function positiveNumber(key: string, fallback: number): number {
  const value = Number(withDefault(key, String(fallback)));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Biến môi trường ${key} phải là số dương, đang là "${process.env[key]}". Kiểm tra file .env`);
  }
  return value;
}

/** Cấu hình tập trung — mọi nơi khác đọc từ đây, KHÔNG đọc process.env trực tiếp */
export const env = {
  baseURL: withDefault('BASE_URL', 'https://book.anhtester.com'),
  apiBaseURL: withDefault('API_BASE_URL', withDefault('BASE_URL', 'https://book.anhtester.com')),
  headless: withDefault('HEADLESS', 'true') !== 'false',
  workers: positiveNumber('WORKERS', 5),
  timeout: positiveNumber('TIMEOUT', 60_000),
  logLevel: withDefault('LOG_LEVEL', 'info'),
  isCI: Boolean(process.env.CI),
} as const;
