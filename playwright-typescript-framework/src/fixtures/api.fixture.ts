import { test as base, expect, request as playwrightRequest } from '@playwright/test';
import { AddressApi } from '../api/address.api';
import { AuthApi } from '../api/auth.api';
import { BookApi } from '../api/book.api';
import { CategoryApi } from '../api/category.api';
import { env } from '../utils/env.config';
import { logger } from '../utils/logger';
import { maskSecrets } from '../utils/report';
import { TestData, type NewUser } from '../utils/test-data';

export interface Account extends NewUser {
  token: string;
}

type Cleanup = (label: string, action: () => Promise<unknown>) => void;

type ApiFixtures = {
  /** Client ẩn danh — không gửi token */
  authApi: AuthApi;
  bookApi: BookApi;
  categoryApi: CategoryApi;
  addressApi: AddressApi;
  /** Client gắn token của tài khoản riêng worker */
  authedAuthApi: AuthApi;
  authedBookApi: BookApi;
  authedCategoryApi: CategoryApi;
  /** Đăng ký việc dọn dữ liệu — chạy ngược thứ tự sau khi test kết thúc, kể cả khi test FAIL */
  cleanup: Cleanup;
};

type WorkerFixtures = {
  /**
   * Tài khoản riêng của từng worker: tự đăng ký qua /api/register + đăng nhập lấy token.
   * Mỗi luồng một tài khoản → chạy song song không giẫm dữ liệu nhau. Chỉ tạo khi có test dùng tới.
   */
  workerAccount: Account;
};

export const test = base.extend<ApiFixtures, WorkerFixtures>({
  workerAccount: [
    async ({}, use, workerInfo) => {
      const context = await playwrightRequest.newContext({ baseURL: env.apiBaseURL });
      const user = TestData.newUser(`worker${workerInfo.workerIndex}`);
      const authApi = new AuthApi(context);

      // Message của expect hiện thành tên step trong report → body phải qua maskSecrets, không lộ token
      const registered = await authApi.register(user);
      expect(registered.status, `Đăng ký tài khoản worker phải trả 201 — body: ${JSON.stringify(maskSecrets(registered.body))}`)
        .toBe(201);
      const loggedIn = await authApi.login({ email: user.email, password: user.password });
      expect(loggedIn.status, `Đăng nhập tài khoản worker phải trả 200 — body: ${JSON.stringify(maskSecrets(loggedIn.body))}`)
        .toBe(200);
      logger.info(`Tạo tài khoản worker ${user.email}`);

      await use({ ...user, token: loggedIn.body.accessToken });
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  authApi: async ({ request }, use) => use(new AuthApi(request)),
  bookApi: async ({ request }, use) => use(new BookApi(request)),
  categoryApi: async ({ request }, use) => use(new CategoryApi(request)),
  addressApi: async ({ request }, use) => use(new AddressApi(request)),

  authedAuthApi: async ({ request, workerAccount }, use) => use(new AuthApi(request, workerAccount.token)),
  authedBookApi: async ({ request, workerAccount }, use) => use(new BookApi(request, workerAccount.token)),
  authedCategoryApi: async ({ request, workerAccount }, use) => use(new CategoryApi(request, workerAccount.token)),

  cleanup: async ({}, use) => {
    const actions: { label: string; action: () => Promise<unknown> }[] = [];
    await use((label, action) => actions.push({ label, action }));

    for (const { label, action } of actions.reverse()) {
      await base.step(`Dọn dữ liệu: ${label}`, async () => {
        try {
          await action();
        } catch (error) {
          // Dọn lỗi không được che kết quả thật của test — chỉ ghi log để truy vết
          logger.warn(`Dọn dữ liệu thất bại (${label}): ${String(error)}`);
        }
      });
    }
  },
});

export { expect } from '@playwright/test';
