import { Page, Locator, expect } from '@playwright/test';
import { logger } from '@utils/logger';

export abstract class BasePage {
  /** Đường dẫn tương đối so với BASE_URL — mỗi page con khai báo của riêng nó */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    logger.info(`Mở trang ${this.path}`);
    await this.page.goto(this.path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click sau khi element đã sẵn sàng — dựa vào auto-waiting của Playwright */
  protected async clickWhenReady(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  /** Điền text, xoá giá trị cũ trước */
  protected async fillField(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return (await locator.innerText()).trim();
  }

  async waitForUrl(pattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }
}
