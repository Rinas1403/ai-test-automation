---
name: tai-khoan-va-du-lieu-test
description: Mỗi worker tự đăng ký tài khoản riêng qua API, tag @account, TestData sinh dữ liệu traceable, fixture cleanup dọn dữ liệu kể cả khi FAIL
type: project
updated: 11-10-2026
---

# Tài khoản & dữ liệu test

## Tài khoản: `workerAccount` (worker-scoped, `src/fixtures/api.fixture.ts`)
- Mỗi worker tự `POST /api/register` một tài khoản riêng rồi `POST /api/login` lấy `accessToken` → 5 luồng không giẫm dữ liệu nhau.
- Email: `auto_worker<N>_<YYYYMMDDHHmmss>_<rand>@auto.test`. Mật khẩu ngẫu nhiên `Auto@<8 hex>A1`, chỉ sống trong bộ nhớ.
- `.env` **không** chứa tài khoản Book.
- Chỉ tạo khi có test dùng fixture → test nào cần tài khoản phải gắn tag **`@account`** để lọc được (`npm run test:account` / `test:no-account`).
- **Quyết định thiết kế:** bản đầu (20-09, repo cũ) dùng 1 tài khoản seed trong `.env`; bản 29-09 chuyển sang tự đăng ký mỗi worker để khỏi lưu mật khẩu và tránh xung đột song song.
- Message của `expect` trong fixture phải qua `maskSecrets` (từng lộ `accessToken` vào tên step).

## Dữ liệu: `TestData` (`src/utils/test-data.ts`)
- Format `auto_<testName>_<YYYYMMDDHHmmss>_<rand4>` — nhìn dữ liệu trên hệ thống là biết test nào, lúc nào tạo.
- `TestData.uniqueId/email/password/phone/newUser(testName)`. Không hardcode email/username/mã.

## Dọn dữ liệu: fixture `cleanup`
- `cleanup('xoá sách X', () => authedBookApi.remove(id))` — đăng ký ngay sau khi tạo.
- Chạy **ngược thứ tự** sau test, **kể cả khi test FAIL**; mỗi lần dọn là 1 step `Dọn dữ liệu: <label>`.
- Dọn lỗi chỉ `logger.warn`, không che kết quả thật của test.

## Lưu ý API Book khi tạo dữ liệu
- `POST /api/book` không trả `id` → dùng `BookApi.findByName(name)` (tra `GET /api/book?search=`), tên phải unique.
- Tạo sách cần danh mục: tạo `POST /api/category-book` trước (tên unique), dọn sau.
- Chi tiết hành vi API: [[module-book-va-category]].
