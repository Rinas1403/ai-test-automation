import { test, expect } from '@fixtures/base.fixture';
import { env } from '@utils/env.config';
import { setTestMeta } from '@utils/report';

test.describe('Đăng nhập', () => {
  test('Đăng nhập thành công với tài khoản admin hợp lệ', { tag: ['@smoke', '@login'] }, async ({ loginPage, dashboardPage }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_001',
      description: 'Kiểm tra người dùng đăng nhập bằng email và mật khẩu admin hợp lệ '
        + 'thì được chuyển vào Dashboard và thấy menu điều hướng bên trái.',
      severity: 'blocker',
      feature: 'Đăng nhập',
    });

    await test.step('Arrange: Mở trang Login', async () => {
      await loginPage.open();
      await expect(loginPage.heading, 'Trang Login phải hiển thị tiêu đề "Login"').toBeVisible();
    });

    await test.step('Act: Đăng nhập bằng tài khoản admin', async () => {
      await loginPage.login(env.username, env.password);
    });

    await test.step('Assert: Hệ thống chuyển vào Dashboard', async () => {
      await expect(dashboardPage.sidebarMenu, 'Sidebar điều hướng phải hiển thị sau khi đăng nhập').toBeVisible();
      await expect(dashboardPage.dashboardMenuLink, 'Menu Dashboard phải có trong sidebar').toBeVisible();
      await expect(dashboardPage.customersMenuLink, 'Menu Customers phải có trong sidebar').toBeVisible();
      await dashboardPage.waitForUrl(/\/admin\/?$/);
    });
  });

  test('Chưa đăng nhập thì truy cập trang quản trị bị chuyển về trang Login', { tag: ['@regression', '@login', '@security'] }, async ({ page, loginPage }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_002',
      description: 'Kiểm tra người dùng chưa đăng nhập mở thẳng URL trang Customers '
        + 'thì bị chuyển hướng về trang Login, không xem được dữ liệu.',
      severity: 'critical',
      feature: 'Đăng nhập',
    });

    await test.step('Arrange: Dùng phiên trình duyệt mới, chưa có cookie đăng nhập', async () => {
      await expect(page.context().cookies(), 'Phiên mới không được có sẵn cookie').resolves.toHaveLength(0);
    });

    await test.step('Act: Mở thẳng URL trang Customers', async () => {
      await page.goto('/admin/clients');
    });

    await test.step('Assert: Hệ thống chuyển về trang Login', async () => {
      await loginPage.waitForUrl(/\/admin\/authentication/);
      await expect(loginPage.loginButton, 'Form đăng nhập phải hiển thị thay cho trang Customers').toBeVisible();
    });
  });
});
