import { defineConfig, devices } from '@playwright/test';
import { env } from './src/utils/env.config';

export default defineConfig({
  testDir: './src/tests',
  timeout: env.timeout,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Parallel LUÔN bật — đổi số luồng ở .env (WORKERS), không sửa file này
  workers: env.workers,
  // Mọi output gom vào reports/ — xem .claude/rules/reporting_rules.md mục 6
  outputDir: 'reports/test-artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    // 'off' vì ảnh được attach thủ công ở fixture finalScreenshot cho CẢ pass lẫn fail
    screenshot: 'off',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      // viewport đặt SAU devices để không bị preset Desktop Chrome (1280×720) ghi đè
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
  ],
});
