# Automation Web — Progress (mode TC) · CRM_LOGIN_TC_011 → 020 · 11-10-2026

- [x] Bước 1: Phân tích test cases — `docs/testcases/test_cases_login_web.md`, Nhóm C (011–020)
- [x] Bước 2: Khảo sát UI (Playwright MCP) — `/admin/authentication`, `/login`, chuyển hướng `/`, `/admin/clients` khi chưa đăng nhập
- [x] Bước 3: Thiết kế POM — `CrmAdminLoginPage`, `CrmClientLoginPage`
- [x] Bước 4: Test data — `test-data/crm-login-invalid.json`, email không tồn tại sinh bằng `TestData.email()`, `TestData.swapCase()`
- [x] Bước 5: Sinh scripts — `src/tests/ui/crm/crm-login.spec.ts` (19 test cho 10 TC)
- [x] Bước 6: Chạy + auto-heal — Chrome/Edge headed 2/2 ổn định · headless 3 trình duyệt 2/2 ổn định · Firefox headed còn treo lúc đóng context ~1/5 lượt
- [ ] Chờ người dùng: khai `ADMIN_PASSWORD`, `CUSTOMER_EMAIL`/`CUSTOMER_PASSWORD`, `TC014_EMAIL`/`TC014_PASSWORD` trong `.env` rồi chạy TC_014, 015, 019, 020

## Kết quả (headed = lượt chốt 1 · headless = lượt 2)

| TC ID | Biến thể | Chrome | Edge | Firefox | Ghi chú |
|---|---|---|---|---|---|
| CRM_LOGIN_TC_011 | a · b · c | ✅ 2/2 | ✅ 2/2 | ✅ 2/2 | |
| CRM_LOGIN_TC_011 | d | ✅ 2/2 | ✅ 2/2 | ⚪ SKIP | Firefox chặn Email toàn khoảng trắng tại trình duyệt |
| CRM_LOGIN_TC_012 | a → e | ✅ 2/2 | ✅ 2/2 | ✅ (headed thỉnh thoảng treo teardown) | |
| CRM_LOGIN_TC_013 | a + b | ✅ 2/2 | ✅ 2/2 | ✅ (headed lượt 2 treo teardown) | |
| CRM_LOGIN_TC_014 | — | ⚪ SKIP | ⚪ SKIP | ⚪ SKIP | Thiếu `TC014_EMAIL`/`TC014_PASSWORD` |
| CRM_LOGIN_TC_015 | a · b | ⚪ SKIP | ⚪ SKIP | ⚪ SKIP | Thiếu `ADMIN_PASSWORD` |
| CRM_LOGIN_TC_016 | — | ❌ FAIL | ❌ FAIL | ❌ FAIL | 🐞 Bug đã biết AMB-LOGIN-10 — ô Email về rỗng |
| CRM_LOGIN_TC_017 | a · b | ✅ 2/2 | ✅ 2/2 | ✅ 2/2 | |
| CRM_LOGIN_TC_018 | — | ✅ 2/2 | ✅ 2/2 | ✅ 2/2 | |
| CRM_LOGIN_TC_019 | — | ⚪ SKIP | ⚪ SKIP | ⚪ SKIP | Thiếu `CUSTOMER_EMAIL`/`CUSTOMER_PASSWORD` |
| CRM_LOGIN_TC_020 | — | ⚪ SKIP | ⚪ SKIP | ⚪ SKIP | Thiếu `CUSTOMER_EMAIL`/`CUSTOMER_PASSWORD` |

## Nhật ký auto-heal
- Vòng 1: TC_017/018 FAIL `303 ≠ 200` — POST trả 303 rồi chuyển hướng; TC đo tài liệu cuối → `submit()` trả phản hồi cuối của chuỗi chuyển hướng → PASS.
- Vòng 2: Firefox TC_011-d timeout chờ POST — Firefox chặn Email toàn khoảng trắng tại trình duyệt → skip riêng Firefox (TC chỉ định Chrome).
- Vòng 3: Firefox treo đóng context → đóng bong bóng cảnh báo (TC_012) + chuyển `test.skip` lên mức describe (không mở trang rồi mới skip). Giảm nhưng chưa hết.
- Vòng 4: thử tắt trình quản lý mật khẩu Firefox → không hiệu quả, đã hoàn tác.
- Vòng 5: tắt video cho `ui-firefox` → từ phần lớn các lượt còn ~1/5 lượt treo; thử thêm `about:blank` trước khi đóng → không hết, đã hoàn tác. Dừng theo giới hạn 5 vòng.

## Files
- Tạo: `src/pages/crm/crm-admin-login.page.ts` · `src/pages/crm/crm-client-login.page.ts` · `src/tests/ui/crm/crm-login.spec.ts` · `test-data/crm-login-invalid.json`
- Sửa: `src/utils/env.config.ts` (khối `crm`) · `src/utils/test-data.ts` (`swapCase`) · `src/fixtures/ui.fixture.ts` · `playwright.config.ts` (Firefox `video: 'off'`) · `.env.example` · `README.md`
