import { defineConfig, devices } from '@playwright/test';
import * as os from 'node:os';
import { env } from './src/utils/env.config';

export default defineConfig({
  testDir: './src/tests',
  globalSetup: './src/utils/global-setup.ts',
  timeout: env.timeout,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 1 : 0,
  // Parallel LUÔN bật — đổi số luồng ở .env (WORKERS), không sửa file này
  workers: env.workers,
  // Mọi output gom vào reports/ — xem .claude/rules/reporting_rules.md mục 6
  outputDir: 'reports/test-artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        environmentInfo: {
          BASE_URL: env.baseURL,
          API_BASE_URL: env.apiBaseURL,
          WORKERS: String(env.workers),
          HEADLESS: String(env.headless),
          NODE: process.version,
          OS: `${os.platform()} ${os.release()}`,
        },
      },
    ],
  ],
  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    // 'off' vì ảnh được attach thủ công ở fixture cho CẢ pass lẫn fail — tránh đính 2 lần
    screenshot: 'off',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: 'vi-VN',
  },
  projects: [
    {
      name: 'ui',
      testDir: './src/tests/ui',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'api',
      testDir: './src/tests/api',
      use: {
        baseURL: env.apiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
