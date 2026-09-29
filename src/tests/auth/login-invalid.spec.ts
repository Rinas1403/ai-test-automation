import { test, expect } from '@fixtures/base.fixture';
import { TestData } from '@utils/test-data';
import { setTestMeta, Severity } from '@utils/report';
import invalidLogins from '@test-data/login-invalid.json';

type InvalidLoginCase = {
  testId: string;
  title: string;
  description: string;
  severity: Severity;
  email: string;
  password: string;
  expectedMessages: string[];
};

test.describe('Đăng nhập — dữ liệu không hợp lệ', () => {
  for (const data of invalidLogins as InvalidLoginCase[]) {
    test(data.title, { tag: ['@regression', '@login', '@data-driven'] }, async ({ loginPage }) => {
      await setTestMeta({
        testId: data.testId,
        description: data.description,
        severity: data.severity,
        feature: 'Đăng nhập',
      });

      const email = TestData.resolve(data.email, 'loginInvalid');
      const password = TestData.resolve(data.password, 'loginInvalid');

      await test.step('Arrange: Mở trang Login', async () => {
        await loginPage.open();
      });

      await test.step('Act: Đăng nhập bằng dữ liệu không hợp lệ', async () => {
        await loginPage.login(email, password);
      });

      await test.step('Assert: Hệ thống ở lại trang Login và báo lỗi', async () => {
        for (const message of data.expectedMessages) {
          await expect(loginPage.errorAlert(message), `Phải hiển thị thông báo lỗi "${message}"`).toBeVisible();
        }
        await loginPage.waitForUrl(/\/admin\/authentication/);
        await expect(loginPage.loginButton, 'Form đăng nhập vẫn phải hiển thị').toBeVisible();
      });
    });
  }
});
