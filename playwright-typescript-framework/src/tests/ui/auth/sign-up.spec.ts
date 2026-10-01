import invalidCases from '../../../../test-data/sign-up-invalid.json';
import { expect, test } from '../../../fixtures/ui.fixture';
import type { SignUpForm } from '../../../pages/sign-up.page';
import { setTestMeta } from '../../../utils/report';
import { TestData } from '../../../utils/test-data';

interface SignUpInvalidCase {
  testId: string;
  case: string;
  withValidName: boolean;
  form: Partial<SignUpForm>;
  expectedErrors: Partial<Record<keyof SignUpForm, string>>;
}

test.describe('Đăng ký tài khoản (Web)', () => {
  for (const data of invalidCases as SignUpInvalidCase[]) {
    test(`Hiển thị lỗi validation khi đăng ký với ${data.case}`, { tag: ['@regression', '@auth', '@ui'] }, async ({ signUpPage, page }) => {
      await setTestMeta({
        testId: data.testId,
        feature: 'Đăng ký',
        severity: 'normal',
        description: `Kiểm tra form Sign up chặn submit và hiển thị đúng thông báo lỗi dưới từng ô khi ${data.case}. `
          + 'Không có tài khoản nào được tạo ra.',
      });

      await test.step('Arrange: Mở trang Sign up', async () => {
        await signUpPage.open();
      });

      await test.step(`Act: Điền form với ${data.case} rồi bấm Register`, async () => {
        const name = data.withValidName ? TestData.newUser('signUpInvalid').name : undefined;
        await signUpPage.fillForm({ ...data.form, name });
        await signUpPage.submit();
      });

      await test.step('Assert: Mỗi ô lỗi hiển thị đúng thông báo và vẫn ở trang Sign up', async () => {
        for (const [field, message] of Object.entries(data.expectedErrors)) {
          await expect(
            signUpPage.fieldInput(field as keyof SignUpForm),
            `Ô "${field}" phải hiển thị lỗi "${message}"`,
          ).toHaveAccessibleDescription(message);
        }
        await expect(page, 'Không được rời trang Sign up khi dữ liệu không hợp lệ').toHaveURL(/\/sign-up$/);
      });
    });
  }
});
