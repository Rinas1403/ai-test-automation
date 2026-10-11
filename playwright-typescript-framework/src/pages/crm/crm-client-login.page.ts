import { test, type Locator } from '@playwright/test';
import { env } from '../../utils/env.config';
import { BasePage } from '../base.page';

/** Trang đăng nhập cổng khách hàng Perfex CRM `/login` — locator verify trên DOM thật ngày 11-10-2026 */
export class CrmClientLoginPage extends BasePage {
  static readonly url = `${env.crm.url}/login`;
  /** Trang chủ cổng khách hàng — chưa đăng nhập thì bị đẩy về /authentication/login */
  static readonly homeUrl = `${env.crm.url}/`;
  static readonly homeTitle = 'HKD Anh Tester';

  protected readonly path = CrmClientLoginPage.url;

  readonly heading = this.page.getByRole('heading', { name: 'Please login' });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email Address' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  /** exact: thanh điều hướng có thêm link " Login" — chỉ lấy nút submit */
  readonly loginButton = this.page.getByRole('button', { name: 'Login', exact: true });

  protected readonly readyIndicator: Locator = this.heading;

  async login(email: string, password: string): Promise<void> {
    await test.step('Đăng nhập cổng khách hàng', async () => {
      await this.fillField(this.emailInput, email, 'Email Address');
      await this.fillField(this.passwordInput, password, 'Password', { secret: true });
      await this.clickWhenReady(this.loginButton, 'nút "Login"');
      await this.page.waitForLoadState();
    });
  }

  async openHome(): Promise<void> {
    await test.step('Mở trang chủ cổng khách hàng', async () => {
      await this.page.goto(CrmClientLoginPage.homeUrl);
    });
  }
}
