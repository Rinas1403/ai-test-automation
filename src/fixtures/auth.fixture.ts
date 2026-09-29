import { test as base, expect } from './base.fixture';
import { DashboardPage } from '@pages/dashboard.page';
import { env } from '@utils/env.config';

type AuthFixtures = {
  /** Dashboard đã đăng nhập sẵn bằng tài khoản admin — mỗi test một browser context riêng */
  loggedInDashboard: DashboardPage;
};

export const test = base.extend<AuthFixtures>({
  loggedInDashboard: async ({ loginPage, dashboardPage }, use) => {
    await base.step('Arrange: Đăng nhập bằng tài khoản admin', async () => {
      await loginPage.open();
      await loginPage.login(env.username, env.password);
      await expect(dashboardPage.sidebarMenu, 'Sidebar phải hiển thị sau khi đăng nhập').toBeVisible();
    });
    await use(dashboardPage);
  },
});

export { expect };
