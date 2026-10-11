---
name: chay-da-trinh-duyet
description: UI chạy tuần tự Chrome → Edge → Firefox, mỗi trình duyệt song song 5 luồng qua scripts/run-browsers.mjs; lỗi click treo của Firefox và cách gộp Allure
type: project
updated: 11-10-2026
nguon: phiên 66726295 (11-10-2026, cwd C:\ai-test-automation\playwright-typescript-framework)
---

# Chạy đa trình duyệt

**Yêu cầu của người dùng (11-10-2026):** test UI chạy trên Chrome, Edge, Firefox; **tuần tự từng trình duyệt**; **mỗi trình duyệt song song 5 luồng**.

## Thiết kế
- `playwright.config.ts` tách project: `ui-chrome` (`channel: 'chrome'`), `ui-edge` (`channel: 'msedge'`), `ui-firefox` (build của Playwright), `api` (không mở browser).
  - Chrome/Edge dùng **bản cài trên máy** → chỉ cần `npx playwright install firefox`.
  - Mỗi project UI có `outputDir: reports/test-artifacts/<project>` — dùng chung thì lượt sau xoá video/trace của lượt trước.
- `scripts/run-browsers.mjs` gọi `playwright test --project=<x>` **lần lượt** (gọi thẳng CLI bằng `node`, không qua shell → tham số có dấu cách không bị tách).
  - Lượt trước FAIL thì lượt sau **vẫn chạy**; cuối in bảng tổng kết, exit 1 nếu có lượt FAIL.
  - Lượt đầu `KEEP_ALLURE_RESULTS=false` (dọn), lượt sau `true` (cộng dồn) → **một** Allure report cho cả 3 trình duyệt, phân biệt bằng tham số `Project`.
  - `HTML_REPORT_DIR=reports/html/<project>` → Playwright HTML report tách theo trình duyệt.
  - Tham số từ `-…` đầu tiên trở đi chuyển thẳng cho Playwright: `npm run test:ui -- --grep "@smoke"`.
- **Không dùng `dependencies` giữa project**: một test fail ở Chrome sẽ làm SKIP toàn bộ Edge/Firefox.

## Lệnh
| Lệnh | Việc |
|---|---|
| `npm test` | api → ui-chrome → ui-edge → ui-firefox |
| `npm run test:ui` | 3 trình duyệt UI |
| `npm run test:chrome` / `test:edge` / `test:firefox` | 1 trình duyệt |
| `npm run test:headed` | ép `HEADLESS=false` |
| `node scripts/run-browsers.mjs ui-edge ui-firefox` | chọn trình duyệt |

## Lỗi Firefox đã gặp (quan trọng)
- Headed + nhiều cửa sổ Firefox chồng nhau → click **treo tới timeout** (tái hiện 3/12 FAIL).
- Nguyên nhân: Windows coi cửa sổ bị che là "occluded", Firefox ngừng xử lý input. Chromium đã được Playwright tắt sẵn (`--disable-backgrounding-occluded-windows`).
- Sửa: `launchOptions.firefoxUserPrefs['widget.windows.window_occlusion_tracking.enabled'] = false`. Sau đó 2 lượt × 12 test PASS. **Đừng xoá pref này.**
- Playwright 1.63 cần bản Firefox riêng — bản cũ trên máy không dùng được, đã cài thêm.

## Firefox headed song song treo khi đóng context (11-10-2026, bộ CRM login)
- Triệu chứng: `Tearing down "context" exceeded the test timeout` — test đã PASS nhưng bị tính timedOut/broken. Chỉ xảy ra **Firefox + headed + nhiều luồng**; 1 luồng hoặc headless thì sạch; bộ Book 4 test không gặp.
- Đã chứng minh: **ghi video** là tác nhân chính → `ui-firefox` đặt `video: 'off'` (trace `retain-on-failure` vẫn giữ). Tỷ lệ còn khoảng 1/5 lượt.
- Thêm 2 biện pháp giúp giảm: skip đặt ở `test.describe(() => { test.skip(...) })` (không mở trang rồi mới skip); đóng bong bóng cảnh báo email (Escape + blur) trước khi kết thúc test.
- Đã thử, **không** hiệu quả (đừng thử lại): tắt `signon.rememberSignons`/`formlessCapture`; `page.goto('about:blank')` trước khi đóng.
- Chưa thử: giảm `WORKERS` riêng cho Firefox headed; nâng/hạ bản Playwright.
- Bài học: muốn đọc kết quả Allure thì **không** truyền `--reporter=...` (ghi đè reporter Allure trong config).

## Kết quả lần bàn giao 11-10-2026
- Headed, 2 lượt: Chrome 4/4 · Edge 4/4 · Firefox 4/4 (tổng 24 PASS). Bộ UI chỉ có 4 test nên thực tế mỗi trình duyệt mở 4 luồng.
- **Chưa chạy headless** — việc tiếp theo.
- Đã cập nhật CI: `npx playwright install --with-deps chrome msedge firefox`.
- Báo cáo Slack: [[bao-cao-slack-ban-giao]] (bị nhắc vì không tự gửi).
