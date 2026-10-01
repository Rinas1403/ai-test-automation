import { expect, test, type Locator, type Page } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * Lớp cha của mọi Page Object.
 * Mỗi thao tác bọc trong test.step → hiện thành sub-step Tiếng Việt trong Allure.
 * Chỉ dùng smart wait (auto-waiting + web-first assertion) — KHÔNG hard sleep.
 */
export abstract class BasePage {
  /** Đường dẫn tương đối của trang, ví dụ '/sign-in' */
  protected abstract readonly path: string;
  /** Element chứng minh trang đã render xong — dùng làm điều kiện chờ sau khi mở trang */
  protected abstract readonly readyIndicator: Locator;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await test.step(`Mở trang ${this.path}`, async () => {
      logger.info(`Mở trang ${this.path}`);
      await this.page.goto(this.path);
      await expect(this.readyIndicator, `Trang ${this.path} phải render xong`).toBeVisible();
    });
  }

  protected async fillField(locator: Locator, value: string, fieldName: string, { secret = false } = {}): Promise<void> {
    await test.step(`Nhập ${fieldName}${secret || value === '' ? '' : `: ${value}`}`, async () => {
      logger.info(`Nhập ${fieldName}`);
      await expect(locator).toBeEditable();
      await locator.fill(value);
    });
  }

  protected async clickWhenReady(locator: Locator, name: string): Promise<void> {
    await test.step(`Bấm ${name}`, async () => {
      logger.info(`Bấm ${name}`);
      await expect(locator).toBeEnabled();
      await locator.click();
    });
  }
}
