---
name: module-auth
description: Module AUTH (đăng ký/đăng nhập) Web + API — locator đã verify, hành vi validation, các TC đã có và TC happy path còn thiếu
type: project
updated: 11-10-2026
---

# Module AUTH — Đăng ký / Đăng nhập

Prefix TC: `BOOK_AUTH_TC_nnn` (dùng chung cho UI lẫn API). Danh sách đầy đủ: [[danh-muc-test-case]].

## Web UI
Trang `/sign-in` (`SignInPage`) — locator verify DOM thật 29-09-2026:
| Element | Locator |
|---|---|
| Tiêu đề | `getByRole('heading', { name: 'Sign in' })` (cũng là `readyIndicator`) |
| Email | `getByRole('textbox', { name: 'Email address', exact: true })` |
| Password | `getByRole('textbox', { name: 'Password', exact: true })` |
| Nút | `getByRole('button', { name: 'Login account' })` · link `Get started` |

Trang `/sign-up` (`SignUpPage`): textbox `Name`, `Phone`, `Email`, `Password`, `Password Confirmation` (đều `exact: true`), nút `Register`, link `Sign in`.

### Hành vi đã kiểm chứng
- Form chỉ validate **khi bấm submit** (không validate lúc rời ô).
- Thông báo lỗi gắn với ô qua `aria-describedby` → assert bằng `expect(input).toHaveAccessibleDescription(message)`; kèm assert vẫn ở URL `/sign-in$` / `/sign-up`.
- Thông báo: `Email is required.`, `Password is required.`, `Invalid email address`, `Name is required.`, `Password confirmation is required.`.
- Form là MUI: `id` tự sinh kiểu `_r_g_` → **không** dùng làm locator. Nhãn trường bắt buộc có dấu sao (`"Password *"`) ở một số chỗ → `getByLabel('Password')` có thể không khớp, dùng `getByRole('textbox', { name, exact })` đã verify.
- Toast lỗi đăng nhập từng hiện chữ mẫu `"This is an info Alert."` (quan sát 20-09-2026) → **không** dùng làm assertion; khẳng định negative bằng: vẫn ở `/sign-in` và không có `accessToken`.
- Data-driven: `test-data/sign-in-invalid.json`, `test-data/sign-up-invalid.json`.

### Còn thiếu
- `BOOK_AUTH_TC_003` (đăng ký thành công) và `BOOK_AUTH_TC_006` (đăng nhập thành công) — chưa viết vì chưa inspect được DOM sau đăng nhập. Cần người dùng tự đăng ký/đăng nhập trong cửa sổ Playwright MCP rồi báo agent snapshot. Khi viết: dựng tài khoản qua API (`workerAccount`/`TestData.newUser`) rồi mới đăng nhập qua UI.

## API (`AuthApi`)
| Method | Endpoint | Hành vi |
|---|---|---|
| `register` | `POST /api/register` | 201 khi hợp lệ; email sai → 422 `{ msg: 'Invalid data.', fields }` |
| `login` | `POST /api/login` | 200 + `accessToken`; thiếu password → 422 |
| `me` | `GET /api/me` | Không token → 401 `Missing or invalid Authorization header` |
| `logout` | `DELETE /api/logout` | |
