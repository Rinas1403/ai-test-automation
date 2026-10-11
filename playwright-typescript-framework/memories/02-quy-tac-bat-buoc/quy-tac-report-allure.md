---
name: quy-tac-report-allure
description: Report phải đọc hiểu được không cần xem code — 5 metadata, step Arrange/Act/Assert Tiếng Việt, ảnh cuối mọi test, cấm stdout, output gom trong reports/
type: feedback
updated: 11-10-2026
nguon: C:\ai-test-automation\.claude\rules\reporting_rules.md
---

# Quy tắc report (Allure)

**Why:** report được QA lead/BA/PM đọc mà không mở code; người dùng kiểm report theo checklist này mỗi lần bàn giao.
**How to apply:** mỗi test mới phải đủ các mục dưới; sau khi chạy, đọc thẳng `reports/allure-results/*.json` để kiểm chứ không chỉ nhìn kết quả PASS.

## 5 metadata bắt buộc mỗi test
| Mục | Cách làm trong repo này |
|---|---|
| Tên test | `test('<Tiếng Việt mô tả hành vi>', ...)` — không phải tên hàm |
| Description · Severity · Feature · TC ID | `await setTestMeta({ testId, feature, severity, description })` (`src/utils/report.ts`) — TC ID gắn qua label `testId`, **không** nhét vào title |
| Tags | `{ tag: ['@smoke', '@auth', '@ui'] }` của Playwright. **Không** khai lại trong Allure (bị nhân đôi) |

## Test body
- Tối thiểu 3 step `Arrange:` / `Act:` / `Assert:` bằng Tiếng Việt, mô tả hành vi nghiệp vụ.
- Method POM (`BasePage.fillField/clickWhenReady/open`) và API (`BaseApi.send`) tự sinh sub-step.
- Ô mật khẩu: `fillField(..., { secret: true })` để tên step không in giá trị.

## Evidence
- **UI:** fixture auto `finalScreenshot` (`src/fixtures/ui.fixture.ts`) đính ảnh full-page cuối MỌI test: `trang_thai_cuoi_cua_test` (PASS) / `trang_thai_khi_that_bai` (FAIL). Vì vậy config để `screenshot: 'off'` (tránh đính 2 lần).
- **API:** không có màn hình → mỗi request đính JSON `request/response` đã qua `maskSecrets`.

## Cấm
- Attachment `stdout`/`stderr` → không dùng `console.log`; dùng `logger` (winston, chỉ ghi file `reports/logs/test-execution.log`, không có console transport).
- Lộ bí mật: message của `expect` **hiện thành tên step** trong report → mọi body đưa vào message phải qua `maskSecrets` (bài học 29-09-2026: token từng lộ qua message expect trong fixture `workerAccount`).

## Output
- Toàn bộ output nằm trong `reports/` (đã `.gitignore`): `allure-results/`, `allure-report/`, `allure-report-single/`, `html/<project>/`, `logs/`, `test-artifacts/<project>/`.
- Vận hành report (Java, Trend, khoá file…): [[allure-report-van-hanh]].
