import { test, expect } from '@fixtures/auth.fixture';
import { setTestMeta } from '@utils/report';

test.describe('Đăng xuất', () => {
  test('Đăng xuất thành công từ menu người dùng', { tag: ['@smoke', '@login', '@logout'] }, async ({ loggedInDashboard, loginPage }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_006',
      description: 'Kiểm tra admin đang đăng nhập bấm Logout trong menu người dùng thì bị đưa về trang Login '
        + 'và không truy cập lại được Dashboard bằng URL.',
      severity: 'critical',
      feature: 'Đăng nhập',
    });
    await test.step('Arrange: Admin đang ở Dashboard (đã đăng nhập qua fixture)', async () => {
      await expect(loggedInDashboard.userProfileMenu, 'Menu người dùng phải hiển thị trên header').toBeVisible();
    });

    await test.step('Act: Đăng xuất từ menu người dùng', async () => {
      await loggedInDashboard.logout();
    });

    await test.step('Assert: Hệ thống quay về trang Login', async () => {
      await loginPage.waitForUrl(/\/admin\/authentication/);
      await expect(loginPage.loginButton, 'Form đăng nhập phải hiển thị sau khi đăng xuất').toBeVisible();
    });

    await test.step('Assert: Mở lại Dashboard bằng URL bị chặn', async () => {
      await loggedInDashboard.open();
      await loginPage.waitForUrl(/\/admin\/authentication/);
    });
  });
});
