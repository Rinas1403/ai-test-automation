import invalidCases from '../../../../test-data/sign-in-invalid.json';
import { expect, test } from '../../../fixtures/ui.fixture';
import type { SignInForm } from '../../../pages/sign-in.page';
import { setTestMeta } from '../../../utils/report';

interface SignInInvalidCase {
  testId: string;
  case: string;
  form: Partial<SignInForm>;
  expectedErrors: Partial<Record<keyof SignInForm, string>>;
}

test.describe('Đăng nhập (Web)', () => {
  for (const data of invalidCases as SignInInvalidCase[]) {
    test(`Hiển thị lỗi validation khi đăng nhập với ${data.case}`, { tag: ['@smoke', '@auth', '@ui'] }, async ({ signInPage, page }) => {
      await setTestMeta({
        testId: data.testId,
        feature: 'Đăng nhập',
        severity: 'normal',
        description: `Kiểm tra form Sign in chặn submit và hiển thị đúng thông báo lỗi dưới từng ô khi ${data.case}.`,
      });

      await test.step('Arrange: Mở trang Sign in', async () => {
        await signInPage.open();
      });

      await test.step(`Act: Điền form với ${data.case} rồi bấm Login account`, async () => {
        await signInPage.fillForm(data.form);
        await signInPage.submit();
      });

      await test.step('Assert: Mỗi ô lỗi hiển thị đúng thông báo và vẫn ở trang Sign in', async () => {
        const inputs = { email: signInPage.emailInput, password: signInPage.passwordInput };
        for (const [field, message] of Object.entries(data.expectedErrors)) {
          await expect(inputs[field as keyof SignInForm], `Ô "${field}" phải hiển thị lỗi "${message}"`)
            .toHaveAccessibleDescription(message);
        }
        await expect(page, 'Không được rời trang Sign in khi dữ liệu không hợp lệ').toHaveURL(/\/sign-in$/);
      });
    });
  }
});
