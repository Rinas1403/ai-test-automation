# Framework Setup Progress

> Stack: Web · Playwright 1.63 · TypeScript · Playwright Test · HTML + Allure 3 · Parallel 5 luồng · GitHub Actions
> Hệ thống: CRM anhtester (`https://crm.anhtester.com/admin`) · Tiền tố TC ID: `CRM_`

- [x] Bước 1: Thu thập yêu cầu — framework đặt ở gốc repo, tiền tố TC `CRM_`
- [x] Bước 2: Scaffold project structure — package.json, tsconfig, playwright.config.ts, .env/.env.example, .gitignore, README
- [x] Bước 3: Sinh base classes — env.config, logger (winston → reports/logs), test-data, report (setTestMeta), BasePage, fixtures
- [x] Bước 4: Sinh example tests — recon DOM thật Login/Dashboard/Logout qua Playwright MCP; 6 test (1 file data-driven JSON)
- [x] Bước 5: Cấu hình reporting & CI/CD — Allure 3 cục bộ (thường + single-file), GitHub Actions headless + parallel
- [x] Bước 6: Verify & Deliver
  - [x] `tsc --noEmit` sạch · `playwright test --list` = 6 test
  - [x] 6/6 PASS — headed ×4, headless ×4, luôn 5 worker song song
  - [x] Allure: tên TV · Description · Severity · Tags (không lặp) · testId · step Arrange/Act/Assert · ảnh cuối PASS & FAIL · không stdout
  - [x] `npx allure --version` = 3.19.0 — chạy từ node_modules, không cài lên máy
  - [x] Root sạch — mọi output trong `reports/`
  - [x] Workflow YAML hợp lệ — timeout 30', upload `if: always()`, secrets không hardcode
