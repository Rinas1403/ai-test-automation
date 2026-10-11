import { test, type Locator, type Response } from '@playwright/test';
import { env } from '../../utils/env.config';
import { BasePage } from '../base.page';

export interface EmailValidity {
  valid: boolean;
  /** Nội dung bong bóng do trình duyệt sinh — đổi theo trình duyệt/ngôn ngữ, chỉ dùng để biết CÓ bong bóng hay không */
  message: string;
}

export interface LoginOutcome {
  /** Nội dung các dải báo lỗi đỏ, theo thứ tự trên xuống */
  errors: string[];
  url: string;
}

/** Trang đăng nhập khu quản trị Perfex CRM `/admin/authentication` — locator verify trên DOM thật ngày 11-10-2026 */
export class CrmAdminLoginPage extends BasePage {
  static readonly url = `${env.crm.url}/admin/authentication`;
  static readonly title = 'Perfex CRM | Anh Tester Demo - Login';

  protected readonly path = CrmAdminLoginPage.url;

  readonly heading = this.page.getByRole('heading', { name: 'Login', exact: true });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email Address' });
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  readonly loginButton = this.page.getByRole('button', { name: 'Login', exact: true });
  /** Dải báo lỗi đỏ của máy chủ — phần tử không có vai trò trợ năng nên phải dùng CSS */
  readonly errorAlerts = this.page.locator('.alert.alert-danger');

  protected readonly readyIndicator: Locator = this.heading;

  async fillCredentials(email: string, password: string, { secretPassword = false } = {}): Promise<void> {
    await test.step('Điền form đăng nhập khu quản trị', async () => {
      await this.fillField(this.emailInput, email, 'Email Address');
      await this.fillField(this.passwordInput, password, 'Password', { secret: secretPassword });
    });
  }

  /**
   * Bấm Login và chờ máy chủ phản hồi. POST trả 303 rồi chuyển hướng (GET) → trả về phản hồi CUỐI của chuỗi,
   * chính là tài liệu trình duyệt hiển thị — để test kiểm HTTP status / HTML máy chủ trả.
   */
  async submit(): Promise<Response> {
    return test.step('Bấm nút "Login" và chờ máy chủ phản hồi', async () => {
      const [postResponse] = await Promise.all([
        this.page.waitForResponse((res) => res.url() === CrmAdminLoginPage.url && res.request().method() === 'POST'),
        this.loginButton.click(),
      ]);
      await this.page.waitForLoadState();
      return finalResponse(postResponse);
    });
  }

  /** Bấm Login khi trình duyệt sẽ chặn form (email sai định dạng) — không chờ phản hồi máy chủ */
  async submitExpectingBrowserBlock(): Promise<void> {
    await this.clickWhenReady(this.loginButton, 'nút "Login"');
  }

  async login(email: string, password: string, { secretPassword = false } = {}): Promise<Response> {
    await this.fillCredentials(email, password, { secretPassword });
    return this.submit();
  }

  /** Đếm số request POST gửi tới trang đăng nhập kể từ lúc gọi — chứng minh form có/không tới được máy chủ */
  trackLoginPosts(): () => number {
    let count = 0;
    this.page.on('request', (req) => {
      if (req.url() === CrmAdminLoginPage.url && req.method() === 'POST') count++;
    });
    return () => count;
  }

  /**
   * Đóng bong bóng cảnh báo của trình duyệt. Firefox headed chạy song song: bong bóng còn mở lúc đóng context
   * thì browserContext.close() treo tới hết timeout.
   */
  async dismissValidationBubble(): Promise<void> {
    await test.step('Đóng bong bóng cảnh báo của trình duyệt', async () => {
      await this.page.keyboard.press('Escape');
      await this.emailInput.blur();
    });
  }

  async emailValidity(): Promise<EmailValidity> {
    return this.emailInput.evaluate((el: HTMLInputElement) => ({ valid: el.validity.valid, message: el.validationMessage }));
  }

  async readOutcome(): Promise<LoginOutcome> {
    return test.step('Đọc các dải báo lỗi và URL', async () => ({
      errors: (await this.errorAlerts.allInnerTexts()).map((text) => text.trim()),
      url: this.page.url(),
    }));
  }
}

/** Đi theo chuỗi chuyển hướng (3xx) tới phản hồi cuối cùng */
async function finalResponse(response: Response): Promise<Response> {
  let current = response;
  for (let next = current.request().redirectedTo(); next; next = next.redirectedTo()) {
    const nextResponse = await next.response();
    if (!nextResponse) break;
    current = nextResponse;
  }
  return current;
}
