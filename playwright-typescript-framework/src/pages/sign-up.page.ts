import { test, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface SignUpForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

/** Trang /sign-up — locator đã verify trên DOM thật ngày 29-09-2026 */
export class SignUpPage extends BasePage {
  protected readonly path = '/sign-up';

  readonly heading = this.page.getByRole('heading', { name: 'Sign up' });
  readonly nameInput = this.page.getByRole('textbox', { name: 'Name', exact: true });
  readonly phoneInput = this.page.getByRole('textbox', { name: 'Phone', exact: true });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email', exact: true });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password', exact: true });
  readonly passwordConfirmationInput = this.page.getByRole('textbox', { name: 'Password Confirmation', exact: true });
  readonly registerButton = this.page.getByRole('button', { name: 'Register' });
  readonly signInLink = this.page.getByRole('link', { name: 'Sign in' });

  protected readonly readyIndicator: Locator = this.heading;

  /** Tra input theo khoá của form — dùng cho test data-driven kiểm lỗi từng field */
  fieldInput(field: keyof SignUpForm): Locator {
    const inputs: Record<keyof SignUpForm, Locator> = {
      name: this.nameInput,
      phone: this.phoneInput,
      email: this.emailInput,
      password: this.passwordInput,
      passwordConfirmation: this.passwordConfirmationInput,
    };
    return inputs[field];
  }

  /** Chỉ điền các field được truyền — field bỏ trống giữ nguyên rỗng */
  async fillForm(form: Partial<SignUpForm>): Promise<void> {
    await test.step('Điền form đăng ký', async () => {
      if (form.name !== undefined) await this.fillField(this.nameInput, form.name, 'Name');
      if (form.phone !== undefined) await this.fillField(this.phoneInput, form.phone, 'Phone');
      if (form.email !== undefined) await this.fillField(this.emailInput, form.email, 'Email');
      if (form.password !== undefined) await this.fillField(this.passwordInput, form.password, 'Password', { secret: true });
      if (form.passwordConfirmation !== undefined) {
        await this.fillField(this.passwordConfirmationInput, form.passwordConfirmation, 'Password Confirmation', { secret: true });
      }
    });
  }

  async submit(): Promise<void> {
    await this.clickWhenReady(this.registerButton, 'nút "Register"');
  }
}
