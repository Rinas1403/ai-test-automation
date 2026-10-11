import { defineConfig, devices, type Project } from '@playwright/test';
import * as os from 'node:os';
import { env } from './src/utils/env.config';

// Headed: viewport phải vừa cửa sổ (cửa sổ không nở sau khi launch) · Headless: không vướng khung → full HD
const uiViewport = env.headless ? { width: 1920, height: 1080 } : { width: 1600, height: 770 };

/**
 * Project UI cho từng trình duyệt — tên project cũng là tham số `--project` của scripts/run-browsers.mjs.
 * outputDir tách riêng: Playwright dọn outputDir mỗi lần chạy, dùng chung thì lượt Edge xoá mất video/trace của Chrome.
 */
const uiProject = (name: string, use: Project['use']): Project => ({
  name,
  testDir: './src/tests/ui',
  outputDir: `reports/test-artifacts/${name}`,
  use: { ...use, viewport: uiViewport },
});

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
  outputDir: 'reports/test-artifacts/api',
  reporter: [
    ['list'],
    ['html', { outputFolder: env.htmlReportDir, open: 'never' }],
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
    // Chrome / Edge dùng bản cài trên máy (channel) — đúng trình duyệt người dùng thật, không phải Chromium build sẵn
    uiProject('ui-chrome', { ...devices['Desktop Chrome'], channel: 'chrome' }),
    uiProject('ui-edge', { ...devices['Desktop Edge'], channel: 'msedge' }),
    uiProject('ui-firefox', {
      ...devices['Desktop Firefox'],
      // Headed + nhiều luồng: Windows coi cửa sổ bị che là "occluded", Firefox ngừng xử lý input → click treo tới timeout.
      // Chromium đã được Playwright tắt sẵn bằng --disable-backgrounding-occluded-windows; Firefox phải tắt bằng pref.
      launchOptions: { firefoxUserPrefs: { 'widget.windows.window_occlusion_tracking.enabled': false } },
      // Ghi video trên Firefox (headed, song song) làm browserContext.close() treo tới hết timeout — tái hiện ~1/3 lượt
      // với bộ CRM login 11-10-2026, tắt video thì 4/4 lượt sạch. Trace (retain-on-failure) vẫn giữ làm bằng chứng.
      video: 'off',
    }),
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
