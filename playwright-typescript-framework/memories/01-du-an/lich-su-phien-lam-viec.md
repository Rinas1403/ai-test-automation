---
name: lich-su-phien-lam-viec
description: Nhật ký các phiên Claude Code đã làm trên framework này (ngày, yêu cầu, kết quả) — dùng để hiểu vì sao code như hiện tại
type: project
updated: 11-10-2026
---

# Lịch sử phiên làm việc

| Ngày | Phiên (thư mục transcript) | Yêu cầu của người dùng | Kết quả chính |
|---|---|---|---|
| 20-09-2026 | `C--source-AI-automation/0ce62978` | `/generate-automation-framework` cho AnhTester Book (Web + API, Allure 2 không cài gì vào máy) | Bản đầu: 14/14 PASS × 2, JRE portable trong `.jre/`, 1 tài khoản seed. Lỗi `&&` trong PowerShell → [[powershell-va-terminal-vscode]] |
| 25-09-2026 | `C--source-AI-automation/2102bd06` | `/generate-automation-web` 10 TC CRM login vào cùng framework; hỏi Allure, Trend | 12/13 PASS (TC_004 bug logo CRM). Thêm giữ Trend, `test:crm`. **Phần CRM không còn trong repo này** |
| 29-09-2026 | `C--ai-test-automation/b43c04c0` | Dựng lại framework ở `C:\ai-test-automation\playwright-typescript-framework` | 16 test, worker tự đăng ký tài khoản, global-setup, bug TC_005, cài JRE Temurin 21, thêm `test:visual/debug/smoke/account` |
| 11-10-2026 | `C--ai-test-automation/66726295` | Chạy UI trên Chrome, Edge, Firefox — tuần tự từng trình duyệt, mỗi trình duyệt 5 luồng | `run-browsers.mjs`, fix Firefox occlusion, 24/24 PASS headed. Bị nhắc gửi Slack → [[bao-cao-slack-ban-giao]] |
| 11-10-2026 | `C--playwright-typescript-framework/0bc94863` | Gom toàn bộ bộ nhớ liên quan vào `memories/` của repo | Tạo `memories/`, `CLAUDE.md` |
| 11-10-2026 | `C--playwright-typescript-framework/0bc94863` | `/generate-automation-web` `docs/testcases/test_cases_login_web.md`, chỉ TC 11–20 | Thêm hệ thống CRM vào framework: 2 Page CRM, 19 test / 10 TC. PASS 13 · FAIL 1 (bug TC_016) · SKIP 5 (thiếu tài khoản). Tìm ra lỗi Firefox ghi video làm treo đóng context. Người dùng yêu cầu gửi Slack khi xong |

Ghi chú: các phiên 11-10-2026 khác trong `C--ai-test-automation` (khám phá hệ thống CRM `crm.anhtester.com`, chạy login CRM trong `crm-playwright-framework`) thuộc **dự án khác**, không ghi vào đây — chỉ lấy mẫu báo cáo Slack từ đó.

**How to apply:** kết thúc mỗi phiên có thay đổi đáng kể → thêm 1 dòng vào bảng.
