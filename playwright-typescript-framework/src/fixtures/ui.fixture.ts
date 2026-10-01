import { SignInPage } from '../pages/sign-in.page';
import { SignUpPage } from '../pages/sign-up.page';
import { test as apiTest } from './api.fixture';

type UiFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  /** Auto fixture: đính ảnh trạng thái cuối cho MỌI test UI — cả PASS lẫn FAIL */
  finalScreenshot: void;
};

/** Test UI kế thừa fixture API — dựng tiền đề (tạo tài khoản, dữ liệu) qua API cho nhanh và ổn định */
export const test = apiTest.extend<UiFixtures>({
  signInPage: async ({ page }, use) => use(new SignInPage(page)),
  signUpPage: async ({ page }, use) => use(new SignUpPage(page)),

  finalScreenshot: [
    async ({ page }, use, testInfo) => {
      await use();
      const name = testInfo.status === 'passed' ? 'trang_thai_cuoi_cua_test' : 'trang_thai_khi_that_bai';
      await testInfo.attach(name, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
