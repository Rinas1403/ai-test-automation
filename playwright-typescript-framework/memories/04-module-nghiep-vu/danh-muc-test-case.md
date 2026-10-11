---
name: danh-muc-test-case
description: Sổ đăng ký TC ID đã dùng (BOOK_<MODULE>_TC_nnn) — tra trước khi đặt mã mới để không trùng, kèm file spec và tag
type: project
updated: 11-10-2026
---

# Danh mục test case (TC ID đã dùng)

**How to apply:** trước khi thêm test, tra bảng này để lấy số kế tiếp, rồi **cập nhật bảng** sau khi thêm. Mã do agent tự đặt (chưa có TC thủ công) — khi có file TC thủ công phải đối chiếu lại.

| TC ID | Tên test | Tầng | File | Tag | Trạng thái |
|---|---|---|---|---|---|
| `BOOK_AUTH_TC_001` | Lỗi validation khi đăng ký với để trống toàn bộ form | UI | `src/tests/ui/auth/sign-up.spec.ts` + `test-data/sign-up-invalid.json` | `@regression @auth @ui` | PASS |
| `BOOK_AUTH_TC_002` | Lỗi validation khi đăng ký với email sai định dạng | UI | như trên | như trên | PASS |
| `BOOK_AUTH_TC_003` | Đăng ký thành công (happy path) | UI | — | — | ⏸️ chưa viết |
| `BOOK_AUTH_TC_004` | Lỗi validation khi đăng nhập để trống email và mật khẩu | UI | `src/tests/ui/auth/sign-in.spec.ts` + `test-data/sign-in-invalid.json` | `@smoke @auth @ui` | PASS |
| `BOOK_AUTH_TC_005` | Lỗi validation khi đăng nhập email sai định dạng | UI | như trên | như trên | PASS |
| `BOOK_AUTH_TC_006` | Đăng nhập thành công (happy path) | UI | — | — | ⏸️ chưa viết |
| `BOOK_AUTH_TC_007` | Đăng ký tài khoản mới qua API thành công | API | `src/tests/api/auth.api.spec.ts` | `@smoke @auth @api @account` | chờ người dùng xác nhận |
| `BOOK_AUTH_TC_008` | Đăng ký qua API bị từ chối khi email sai định dạng | API | như trên | `@regression @auth @api` | PASS |
| `BOOK_AUTH_TC_009` | Đăng nhập qua API bị từ chối khi thiếu mật khẩu | API | như trên | `@regression @auth @api` | PASS |
| `BOOK_AUTH_TC_010` | Lấy thông tin cá nhân bị từ chối khi không gửi token | API | như trên | `@smoke @auth @api @security` | PASS |
| `BOOK_AUTH_TC_011` | Đăng nhập qua API rồi lấy đúng thông tin cá nhân | API | như trên | `@smoke @auth @api @account` | chờ người dùng xác nhận |
| `BOOK_BOOK_TC_001` | Lấy danh sách sách có phân trang theo limit | API | `src/tests/api/book.api.spec.ts` | `@smoke @book @api` | PASS |
| `BOOK_BOOK_TC_002` | Lấy danh sách sách bị từ chối khi limit < 1 | API | như trên | `@regression @book @api` | PASS |
| `BOOK_BOOK_TC_003` | Xem chi tiết sách không tồn tại trả về 404 | API | như trên | `@regression @book @api` | PASS |
| `BOOK_BOOK_TC_004` | Tạo sách bị từ chối khi không gửi token | API | như trên | `@smoke @book @api @security` | PASS |
| `BOOK_BOOK_TC_005` | Tạo, xem và xoá sách của chính mình | API | như trên | `@smoke @book @api @account` | ❌ FAIL do bug hệ thống ([[known-issues-he-thong]]) |
| `BOOK_ADDRESS_TC_001` | Lấy danh sách tỉnh/thành phố | API | `src/tests/api/address.api.spec.ts` | `@smoke @address @api` | PASS |
| `BOOK_ADDRESS_TC_002` | Lấy danh sách phường/xã theo tỉnh/thành phố | API | như trên | `@regression @address @api` | PASS |

## Perfex CRM — `CRM_LOGIN_TC_nnn` (mã lấy từ file TC thật, KHÔNG tự cấp)
Spec: `src/tests/ui/crm/crm-login.spec.ts`. Mỗi biến thể là 1 test riêng, cùng `testId`. Chi tiết: [[module-crm-login]].

| TC ID | Biến thể | Trạng thái (11-10-2026) |
|---|---|---|
| `CRM_LOGIN_TC_011` | a (smoke) · b · c · d | PASS 3 trình duyệt; d SKIP trên Firefox |
| `CRM_LOGIN_TC_012` | a → e | PASS |
| `CRM_LOGIN_TC_013` | a + b trong 1 test (phải so sánh) | PASS |
| `CRM_LOGIN_TC_014` | — | SKIP: thiếu `TC014_EMAIL/PASSWORD` |
| `CRM_LOGIN_TC_015` | a · b | SKIP: thiếu `ADMIN_PASSWORD` |
| `CRM_LOGIN_TC_016` | — | ❌ FAIL có chủ đích — bug AMB-LOGIN-10 |
| `CRM_LOGIN_TC_017` | a · b | PASS |
| `CRM_LOGIN_TC_018` | — | PASS |
| `CRM_LOGIN_TC_019`, `CRM_LOGIN_TC_020` | — | SKIP: thiếu `CUSTOMER_EMAIL/PASSWORD` |
| `CRM_LOGIN_TC_001–010`, `021–051` | — | Chưa automate trong repo này |

## Số kế tiếp (Book)
Số kế tiếp: `BOOK_AUTH_TC_012`, `BOOK_BOOK_TC_006`, `BOOK_ADDRESS_TC_003` (module mới → `BOOK_<MODULE>_TC_001`).

> Lưu ý đếm: Allure đếm theo lần chạy test, không theo TC. UI chạy 3 trình duyệt → mỗi TC UI xuất hiện 3 lần (tham số `Project`). Test tham số hoá nhiều biến thể cùng `testId` vẫn tính 1 TC khi truy vết (bài học CRM 25-09-2026: 10 TC → 13 test Allure vì TC_007 tách 4 biến thể).
