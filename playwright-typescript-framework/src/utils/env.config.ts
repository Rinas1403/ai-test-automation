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

/** Biến không bắt buộc — trống thì trả undefined để test cần nó tự skip kèm lý do */
function optional(key: string): string | undefined {
  const value = process.env[key];
  return value === undefined || value === '' ? undefined : value;
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
  /** Script chạy tuần tự từng trình duyệt đặt 2 biến dưới — chạy lẻ `playwright test` thì giữ mặc định */
  htmlReportDir: withDefault('HTML_REPORT_DIR', 'reports/html'),
  keepAllureResults: withDefault('KEEP_ALLURE_RESULTS', 'false') === 'true',
  /** Hệ thống Perfex CRM (crm.anhtester.com) — tên biến tài khoản theo đúng file TC docs/testcases/test_cases_login_web.md */
  crm: {
    url: withDefault('CRM_URL', 'https://crm.anhtester.com').replace(/\/$/, ''),
    adminEmail: withDefault('ADMIN_EMAIL', 'admin@example.com'),
    adminPassword: optional('ADMIN_PASSWORD'),
    customerEmail: optional('CUSTOMER_EMAIL'),
    customerPassword: optional('CUSTOMER_PASSWORD'),
    tc014Email: optional('TC014_EMAIL'),
    tc014Password: optional('TC014_PASSWORD'),
  },
} as const;
