import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${key}. Kiểm tra file .env (mẫu ở .env.example)`);
  }
  return value;
}

export const env = {
  baseURL: required('BASE_URL'),
  username: required('TEST_USERNAME'),
  password: required('TEST_PASSWORD'),
  headless: process.env.HEADLESS !== 'false',
  workers: Number(process.env.WORKERS ?? 5),
  timeout: Number(process.env.TIMEOUT ?? 30_000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
} as const;
