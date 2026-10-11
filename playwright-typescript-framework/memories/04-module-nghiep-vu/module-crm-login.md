---
name: module-crm-login
description: Hệ thống thứ 2 — Perfex CRM (crm.anhtester.com) module LOGIN — file TC, locator đã verify, hành vi máy chủ (303, dải lỗi), biến .env, TC đã automate/skip
type: project
updated: 11-10-2026
---

# Perfex CRM — module LOGIN (Web)

Từ 11-10-2026 repo này test thêm **hệ thống thứ 2**: Perfex CRM `https://crm.anhtester.com` (Book vẫn là hệ thống gốc).

## Nguồn
- File TC: `docs/testcases/test_cases_login_web.md` — 51 TC `CRM_LOGIN_TC_001 → 051`, chia nhóm A–K, có biến thể `a/b/c…` trong 1 TC. Nền tảng TC ghi: **Google Chrome**, viewport 1600×750.
- File TC trỏ tới `TEST_CASES_LOGIN_SUMMARY.md` và `docs/requirements/...` — **không có** trong repo này.
- TC 001–010 từng được automate ở repo cũ `C:\source-AI-automation` (25-09-2026), **không** có trong repo này.

## Code
- Page: `src/pages/crm/crm-admin-login.page.ts` (`CrmAdminLoginPage`), `crm-client-login.page.ts` (`CrmClientLoginPage`) — fixture `crmAdminLoginPage`, `crmClientLoginPage` trong `ui.fixture.ts`.
- Test: `src/tests/ui/crm/crm-login.spec.ts` (nằm trong `src/tests/ui` → chạy trên cả 3 trình duyệt). Dữ liệu biến thể: `test-data/crm-login-invalid.json`.
- Cấu hình: khối `env.crm` trong `env.config.ts`. Biến `.env` **đặt theo đúng tên trong TC**: `CRM_URL`, `ADMIN_EMAIL` (mặc định `admin@example.com`), `ADMIN_PASSWORD`, `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`, `TC014_EMAIL`, `TC014_PASSWORD`. Thiếu → test SKIP kèm lý do.
- 11-10-2026 `.env` **chưa có** biến CRM nào → TC_014, 015, 019, 020 đang SKIP. Agent không tự ghi mật khẩu vào `.env` — người dùng tự khai.

## Locator (verify DOM thật 11-10-2026)
| Trang | Element | Locator |
|---|---|---|
| `/admin/authentication` | Tiêu đề | `getByRole('heading', { name: 'Login', exact: true })` · title tab `Perfex CRM \| Anh Tester Demo - Login` |
| | Email / Password | `getByRole('textbox', { name: 'Email Address' })` · `{ name: 'Password' }` (input `type=email` không `required`) |
| | Nút | `getByRole('button', { name: 'Login', exact: true })` |
| | Dải lỗi đỏ | `.alert.alert-danger` (không có role → CSS) |
| `/login` (cổng khách hàng) | Tiêu đề / form | heading `Please login`, textbox `Email Address`/`Password` (`type=text`), button `Login` exact (thanh nav có thêm link " Login") |

## Hành vi máy chủ đã đo
- POST `/admin/authentication` trả **303** → GET 200. Kiểm "HTTP 200 / không 500" phải lấy phản hồi **cuối** (`submit()` đã đi theo `redirectedTo()`).
- Form rỗng → 2 dải: `The Password field is required.` rồi `The Email Address field is required.`. Sai thông tin → 1 dải `Invalid email or password`.
- Email sai định dạng bị **trình duyệt** chặn (không POST). Chrome: `"   "` được làm sạch thành `""` hợp lệ → gửi đi; **Firefox coi là không hợp lệ** → TC_011-d skip trên Firefox.
- Chưa đăng nhập: `/` → `/authentication/login`; `/admin/clients` → `/admin/authentication`. Đăng nhập cổng khách hàng thành công → `/`, title `HKD Anh Tester` (theo TC, chưa tự kiểm vì không có tài khoản).
- Không có cơ chế khoá tài khoản (REQ-LOGIN-41) → thử sai lặp lại an toàn trên môi trường dùng chung.

## Trạng thái TC 011–020: [[danh-muc-test-case]] · Bug TC_016: [[known-issues-he-thong]]
