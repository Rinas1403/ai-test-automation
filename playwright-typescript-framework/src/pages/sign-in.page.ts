import { test, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface SignInForm {
  email: string;
  password: string;
}

/** Trang /sign-in — locator đã verify trên DOM thật ngày 29-09-2026 */
export class SignInPage extends BasePage {
  protected readonly path = '/sign-in';

  readonly heading = this.page.getByRole('heading', { name: 'Sign in' });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email address', exact: true });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password', exact: true });
  readonly loginButton = this.page.getByRole('button', { name: 'Login account' });
  readonly getStartedLink = this.page.getByRole('link', { name: 'Get started' });

  protected readonly readyIndicator: Locator = this.heading;

  async fillForm(form: Partial<SignInForm>): Promise<void> {
    await test.step('Điền form đăng nhập', async () => {
      if (form.email !== undefined) await this.fillField(this.emailInput, form.email, 'Email address');
      if (form.password !== undefined) await this.fillField(this.passwordInput, form.password, 'Password', { secret: true });
    });
  }

  async submit(): Promise<void> {
    await this.clickWhenReady(this.loginButton, 'nút "Login account"');
  }

  async signIn(form: SignInForm): Promise<void> {
    await this.fillForm(form);
    await this.submit();
  }
}
