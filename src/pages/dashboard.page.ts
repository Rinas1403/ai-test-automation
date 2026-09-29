import { test } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '@utils/logger';

/** Trang Dashboard admin — locator đã verify trên DOM thật ngày 29-09-2026 */
export class DashboardPage extends BasePage {
  protected readonly path = '/admin/';

  readonly sidebarMenu = this.page.getByRole('complementary');
  readonly dashboardMenuLink = this.sidebarMenu.getByRole('link', { name: 'Dashboard' });
  readonly customersMenuLink = this.sidebarMenu.getByRole('link', { name: 'Customers' });
  // Khối profile trên header — tooltip Bootstrap xoá accessible name sau khi mở dropdown nên dùng class
  readonly userProfileMenu = this.page.locator('li.header-user-profile');
  readonly userProfileToggle = this.userProfileMenu.locator('a.dropdown-toggle');
  readonly logoutLink = this.userProfileMenu.getByRole('link', { name: 'Logout' });

  async logout(): Promise<void> {
    logger.info('Đăng xuất khỏi hệ thống');
    await test.step('Mở menu người dùng', () => this.clickWhenReady(this.userProfileToggle));
    await test.step('Bấm Logout', () => this.clickWhenReady(this.logoutLink));
  }
}
