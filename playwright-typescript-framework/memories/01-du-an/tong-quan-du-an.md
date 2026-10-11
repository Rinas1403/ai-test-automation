---
name: tong-quan-du-an
description: Repo này là gì, test hệ thống nào, nguồn gốc từ đâu, trạng thái hiện tại và các việc còn treo
type: project
updated: 11-10-2026
---

# Tổng quan dự án

## Repo này là gì
- **Web UI + API automation framework** cho hệ thống **AnhTester Book**.
  - Web: `https://book.anhtester.com` (`/sign-up`, `/sign-in`)
  - API: Swagger/Scalar `https://book.anhtester.com/swagger` — spec JSON thật ở `/swagger/json` (OpenAPI 3.0, ~22 endpoint, auth `BearerAuth`).
- Stack: Playwright Test + TypeScript · Allure Report 2 (`allure-commandline` trong `node_modules`) · Playwright HTML report · winston · GitHub Actions.
- Prefix TC ID: `BOOK_<MODULE>_TC_<3 số>` — xem [[danh-muc-test-case]].
- **Hệ thống thứ 2 (từ 11-10-2026): Perfex CRM** `https://crm.anhtester.com` — module LOGIN, TC `CRM_LOGIN_TC_nnn` lấy từ `docs/testcases/test_cases_login_web.md`. Xem [[module-crm-login]].

## Nguồn gốc (lineage)
| Thời điểm | Vị trí | Ghi chú |
|---|---|---|
| 20-09-2026 | `C:\source-AI-automation\playwright-typescript-framework` | Bản dựng **đầu tiên** (đã không còn trên máy). Dùng JRE portable tải vào `.jre/`, có thêm bộ test CRM login (`CRM_LOGIN_TC_001..010`) — **không còn trong repo hiện tại**. Bài học vẫn còn giá trị, xem [[allure-report-van-hanh]] |
| 29-09-2026 | `C:\ai-test-automation\playwright-typescript-framework` | Bản dựng lại bằng `/generate-automation-framework` (phiên `b43c04c0`). Máy cài JRE Temurin 21 thay cho JRE portable |
| 11-10-2026 (03:37) | như trên | Thêm chạy đa trình duyệt Chrome → Edge → Firefox (phiên `66726295`) — xem [[chay-da-trinh-duyet]] |
| 11-10-2026 | `C:\playwright-typescript-framework` (repo này) | Bản sao tách riêng thành repo độc lập. Thêm `memories/`. Người dùng chép thêm từ repo cha: `CLAUDE.md` (bản đầy đủ — đã chèn lại mục "BƯỚC 0 đọc memories"), `.claude/` (rules, skills, commands), `.mcp.json`, file TC CRM |

- Repo cha `C:\ai-test-automation` chứa `CLAUDE.md` gốc (rất dài), `.claude/rules/`, `.claude/skills/`, `.claude/commands/` và `docs/bugs/`. Các quy tắc liên quan đến repo này đã được rút gọn vào `memories/02-quy-tac-bat-buoc/`.
- Bug report duy nhất hiện có nằm ở **repo cha**: `C:\ai-test-automation\docs\bugs\book\api\BUG_book_1790690300_TC005.md`.
- Repo này **chưa phải git repo** (11-10-2026).

## Trạng thái hiện tại (11-10-2026)
- 16 TC: 4 UI validation (mỗi TC chạy trên 3 trình duyệt) + 12 API (3 trong số đó gắn `@account`) — xem [[danh-muc-test-case]].
- Đa trình duyệt: 2 lượt headed × 3 trình duyệt đều 4/4 PASS.
- `BOOK_BOOK_TC_005` **FAIL có chủ đích** do bug hệ thống (200 ≠ 201) — xem [[known-issues-he-thong]].

## Việc còn treo
- [ ] Viết test **happy path UI**: đăng ký thành công (`BOOK_AUTH_TC_003`) và đăng nhập thành công (`BOOK_AUTH_TC_006`). Bị chặn vì agent không được tự tạo tài khoản/nhập mật khẩu trên site ngoài → cần người dùng tự đăng ký + đăng nhập trong cửa sổ Playwright MCP rồi báo để agent snapshot DOM trang sau đăng nhập.
- [ ] Người dùng chạy `npm run test:account` **2 lần** để xác nhận `BOOK_AUTH_TC_007`, `BOOK_AUTH_TC_011` PASS (TC_005 vẫn FAIL do bug).
- [ ] Chạy **headless** cả 3 trình duyệt — cột Headless trong báo cáo Slack đang trống.
- [ ] TC ID `BOOK_*` do agent tự đặt vì chưa có file TC thủ công trong `docs/testcases/` → khi có TC thủ công phải đối chiếu lại.
- [ ] Khai biến CRM trong `.env` (`ADMIN_PASSWORD`, `CUSTOMER_EMAIL/PASSWORD`, `TC014_EMAIL/PASSWORD`) rồi chạy `CRM_LOGIN_TC_014, 015, 019, 020` — người dùng tự khai.
- [ ] Lập bug report cho `CRM_LOGIN_TC_016` (`/create-bug-report`) nếu người dùng đồng ý.
- [ ] Firefox headed song song còn treo đóng context ~1/5 lượt — xem [[chay-da-trinh-duyet]].
