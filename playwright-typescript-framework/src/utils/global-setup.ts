import fs from 'node:fs';
import path from 'node:path';
import { env } from './env.config';

const reportsDir = path.resolve(__dirname, '../../reports');
const resultsDir = path.join(reportsDir, 'allure-results');
const previousHistory = path.join(reportsDir, 'allure-report', 'history');

/**
 * Chạy 1 lần trong process chính, trước mọi worker:
 * - Xoá allure-results của lần chạy trước → report chỉ phản ánh đúng lần chạy này, không cộng dồn
 * - Chép history của report trước vào results → Allure 2 vẫn vẽ được biểu đồ Trend giữa các lần chạy
 *
 * Chạy tuần tự nhiều trình duyệt (scripts/run-browsers.mjs): chỉ lượt đầu dọn, các lượt sau
 * có KEEP_ALLURE_RESULTS=true để kết quả Chrome → Edge → Firefox cộng dồn vào cùng một report.
 */
export default function globalSetup(): void {
  if (env.keepAllureResults) return;
  // Windows: file có thể bị khoá tạm (VS Code extension, allure open) → để Node tự thử lại khi gặp EBUSY/EPERM
  fs.rmSync(resultsDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  fs.mkdirSync(resultsDir, { recursive: true });
  if (fs.existsSync(previousHistory)) {
    fs.cpSync(previousHistory, path.join(resultsDir, 'history'), { recursive: true });
  }
}
