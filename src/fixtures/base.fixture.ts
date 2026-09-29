import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { DashboardPage } from '@pages/dashboard.page';
import { logger } from '@utils/logger';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type AutoFixtures = {
  finalScreenshot: void;
};

export const test = base.extend<Pages & AutoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  /**
   * Chạy tự động cho MỌI test (auto: true): đính ảnh trạng thái cuối ở teardown —
   * PASS → trang_thai_cuoi_cua_test · FAIL → trang_thai_khi_that_bai.
   */
  finalScreenshot: [
    async ({ page }, use, testInfo) => {
      logger.info(`▶ Bắt đầu: ${testInfo.title}`);
      await use();

      const passed = testInfo.status === testInfo.expectedStatus;
      const name = passed ? 'trang_thai_cuoi_cua_test' : 'trang_thai_khi_that_bai';
      await testInfo.attach(name, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      logger.info(`■ Kết thúc: ${testInfo.title} — ${testInfo.status}`);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
