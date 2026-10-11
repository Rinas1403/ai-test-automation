---
name: cau-truc-va-lop-co-so
description: Bản đồ thư mục src/, các lớp cơ sở BasePage/BaseApi, fixture api/ui, cách thêm Page/API/test mới cho đúng khuôn
type: project
updated: 11-10-2026
---

# Cấu trúc & lớp cơ sở

## Bản đồ nhanh
| Muốn làm | Sửa ở đâu |
|---|---|
| Thêm trang Web | `src/pages/<tên>.page.ts` kế thừa `BasePage` → đăng ký fixture trong `src/fixtures/ui.fixture.ts` |
| Thêm nhóm endpoint API | `src/api/<tên>.api.ts` kế thừa `BaseApi` → đăng ký fixture (ẩn danh + `authed*`) trong `src/fixtures/api.fixture.ts` |
| Thêm test UI | `src/tests/ui/<module>/<tên>.spec.ts`, import `test, expect` từ `fixtures/ui.fixture` |
| Thêm test API | `src/tests/api/<tên>.api.spec.ts`, import từ `fixtures/api.fixture` |
| Data-driven | JSON trong `test-data/` (VD `sign-in-invalid.json` có `testId`, `case`, `form`, `expectedErrors`) |
| Cấu hình | `.env` → `src/utils/env.config.ts` (không đọc `process.env` chỗ khác) |
| Số luồng | `WORKERS` trong `.env` / CI `env.WORKERS` — **không sửa `playwright.config.ts`** |

## `BasePage` (`src/pages/base.page.ts`)
- Bắt buộc khai `path` và `readyIndicator` (element chứng minh trang đã render). `open()` = `goto(path)` + `expect(readyIndicator).toBeVisible()`.
- `fillField(locator, value, fieldName, { secret })` chờ `toBeEditable` rồi `fill`; `clickWhenReady(locator, name)` chờ `toBeEnabled` rồi `click`. Mỗi method bọc `test.step` Tiếng Việt + `logger.info`.
- Locator khai `readonly` ở Page class, ghi chú ngày verify DOM thật (VD "verify ngày 29-09-2026").

## `BaseApi` (`src/api/base.api.ts`)
- `send<T>(method, url, { data, params })` → 1 step `API: <METHOD> <path>`, đính JSON request/response đã che bí mật, trả `{ status, body }` (không throw khi 4xx — test tự assert status).
- Token Bearer truyền qua constructor; client ẩn danh để trống.
- Kiểu body chung: `ErrorBody { msg, fields? }` (422 có `fields`), `MessageBody { msg }`.

## Fixture
- `api.fixture.ts`: `authApi/bookApi/categoryApi/addressApi` (ẩn danh), `authedAuthApi/authedBookApi/authedCategoryApi` (gắn token của `workerAccount`), `cleanup(label, action)` — chi tiết [[tai-khoan-va-du-lieu-test]].
- `ui.fixture.ts` **kế thừa** `api.fixture` (test UI dựng tiền đề qua API cho nhanh) + `signInPage`, `signUpPage` + auto fixture `finalScreenshot`.

## Khuôn test chuẩn
```ts
test('Tên Tiếng Việt mô tả hành vi', { tag: ['@smoke', '@book', '@api'] }, async ({ bookApi }) => {
  await setTestMeta({ testId: 'BOOK_BOOK_TC_006', feature: 'Sách', severity: 'normal', description: '...' });
  await test.step('Arrange: ...', async () => { /* ... */ });
  const res = await test.step('Act: ...', async () => bookApi.list());
  await test.step('Assert: ...', async () => { expect(res.status, 'message rõ ràng').toBe(200); });
});
```
- Tag chuẩn: `@smoke` / `@regression` + module (`@auth`, `@book`, `@address`) + tầng (`@ui`, `@api`) + `@security` (kiểm thiếu token) + `@account` (test tự đăng ký tài khoản).
- Quy tắc report: [[quy-tac-report-allure]].

## Cấu hình Playwright đáng nhớ
- `globalSetup: src/utils/global-setup.ts` (dọn `allure-results` + chép history — xem [[allure-report-van-hanh]]).
- `timeout` từ `.env` (60s), `expect` 10s, `actionTimeout` 15s, `navigationTimeout` 30s, `locale: vi-VN`.
- `retries`: CI 1, local 0. `forbidOnly` trên CI. `video`/`trace`: `retain-on-failure`.
- 4 project: `ui-chrome`, `ui-edge`, `ui-firefox`, `api` — [[chay-da-trinh-duyet]].
