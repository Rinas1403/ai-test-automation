import { test } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '@utils/logger';

/** Trang đăng nhập admin — locator đã verify trên DOM thật ngày 29-09-2026 */
export class LoginPage extends BasePage {
  protected readonly path = '/admin/authentication';

  readonly heading = this.page.getByRole('heading', { name: 'Login', level: 1 });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email Address' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  readonly rememberMeCheckbox = this.page.getByRole('checkbox', { name: 'Remember me' });
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  // Thông báo lỗi render dạng <div class="alert alert-danger"> — không có role/aria, dùng CSS fallback
  readonly errorAlerts = this.page.locator('.alert.alert-danger');

  /** test.step lồng trong POM → hiện thành sub-step trong report */
  async login(email: string, password: string): Promise<void> {
    logger.info(`Đăng nhập với email: ${email}`);
    await test.step(`Nhập email: ${email}`, () => this.fillField(this.emailInput, email));
    await test.step('Nhập mật khẩu', () => this.fillField(this.passwordInput, password));
    await test.step('Bấm nút Login', () => this.clickWhenReady(this.loginButton));
  }

  /** Alert lỗi chứa đúng nội dung message */
  errorAlert(message: string) {
    return this.errorAlerts.filter({ hasText: message });
  }
}
