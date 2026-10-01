# Framework Setup Progress — playwright-typescript-framework

- [x] Bước 1: Thu thập yêu cầu (Web UI + API · Playwright TS · Allure 2 CLI trong project, máy tự có JRE · TC ID `BOOK_<MODULE>_TC_nnn`)
- [x] Bước 2: Scaffold project structure
- [x] Bước 3: Sinh base classes (BasePage · BaseApi · fixtures ui/api · env/logger/test-data/report · global-setup)
- [~] Bước 4: Sinh example tests — 16 test (4 UI validation · 12 API)
  - [ ] Chờ user: test happy path UI đăng ký / đăng nhập (cần inspect DOM sau khi user tự đăng ký + đăng nhập)
- [x] Bước 5: Cấu hình reporting & CI/CD
- [~] Bước 6: Verify & Deliver
  - [x] Typecheck · 13 test không tạo tài khoản PASS 2 lần liên tiếp, headed, 5 worker
  - [x] Allure 2 sinh report được (JRE Temurin 21 đã cài) · 13/13 · trend history · không lộ token
  - [x] Bug spec lệch: `docs/bugs/book/api/BUG_book_1790690300_TC005.md` (POST /api/book 200 ≠ 201)
  - [ ] Chờ user: chạy lại `npm run test:account` 2 lần — kỳ vọng TC_007, TC_011 PASS · TC_005 FAIL do bug
