import fs from 'node:fs';
import path from 'node:path';

const reportsDir = path.resolve(__dirname, '../../reports');
const resultsDir = path.join(reportsDir, 'allure-results');
const previousHistory = path.join(reportsDir, 'allure-report', 'history');

/**
 * Chạy 1 lần trong process chính, trước mọi worker:
 * - Xoá allure-results của lần chạy trước → report chỉ phản ánh đúng lần chạy này, không cộng dồn
 * - Chép history của report trước vào results → Allure 2 vẫn vẽ được biểu đồ Trend giữa các lần chạy
 */
export default function globalSetup(): void {
  // Windows: file có thể bị khoá tạm (VS Code extension, allure open) → để Node tự thử lại khi gặp EBUSY/EPERM
  fs.rmSync(resultsDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  fs.mkdirSync(resultsDir, { recursive: true });
  if (fs.existsSync(previousHistory)) {
    fs.cpSync(previousHistory, path.join(resultsDir, 'history'), { recursive: true });
  }
}
