# CRM Automation — Playwright + TypeScript

Framework tự động hoá kiểm thử web cho hệ thống **CRM** (Perfex CRM — `https://crm.anhtester.com/admin`).

| Thành phần | Giá trị |
|---|---|
| Runner | Playwright Test |
| Ngôn ngữ | TypeScript (strict) |
| Mô hình | Page Object Model + custom fixtures |
| Report | Playwright HTML + **Allure 3** (CLI cài trong project) |
| Parallel | **Bật sẵn — 5 luồng** (`WORKERS`) |
| CI/CD | GitHub Actions — `.github/workflows/playwright.yml` |

## 1. Yêu cầu

- **Node.js ≥ 20** — thứ duy nhất cần có trên máy. **Không** cần Java, **không** cần cài Allure.

## 2. Cài đặt

```bash
npm install
npx playwright install chromium
cp .env.example .env          # rồi điền TEST_USERNAME / TEST_PASSWORD
```

| Biến `.env` | Ý nghĩa | Mặc định |
|---|---|---|
| `BASE_URL` | Gốc hệ thống (không có `/admin`) | `https://crm.anhtester.com` |
| `TEST_USERNAME` / `TEST_PASSWORD` | Tài khoản admin test | — (bắt buộc) |
| `HEADLESS` | `false` = mở browser thật để debug | `true` |
| `WORKERS` | Số luồng song song | `5` |
| `TIMEOUT` | Timeout mỗi test (ms) | `30000` |
| `LOG_LEVEL` | Mức log winston | `info` |

> `.env` đã bị `.gitignore` chặn — **không** commit credentials.

## 3. Chạy test

```bash
npm test                      # toàn bộ suite, headless, 5 luồng
npm run test:headed           # mở browser thật — dùng khi debug
npm run test:smoke            # chỉ test gắn @smoke
npx playwright test --grep @login
npm run test:list             # liệt kê test (không chạy)
```

### Đổi số luồng — đúng 1 chỗ

- **Local:** sửa `WORKERS` trong `.env`, hoặc chạy nhất thời: `npx cross-env WORKERS=2 playwright test`
- **CI:** sửa dòng `WORKERS:` ở khối `env:` đầu file `.github/workflows/playwright.yml`

`playwright.config.ts` đọc `WORKERS` từ env — **không** sửa số luồng trong file config.

## 4. Mở report

```bash
npm run report                # sinh + mở Allure report (reports/allure-report)
npm run report:single         # report gộp 1 file HTML → reports/allure-report-single/index.html
npm run report:html           # Playwright HTML report
```

- Allure CLI là devDependency `allure` (Allure 3, chạy thuần Node) — `npm install` là có, **không** cài gì lên máy.
- Người chỉ cần xem, không có Node → gửi file `reports/allure-report-single/index.html`, mở bằng browser.
- ⚠️ Report chứa **ảnh chụp hệ thống thật** — kiểm nội dung trước khi gửi ra ngoài team.

Mỗi test trong report có: tên Tiếng Việt · Description · Severity · Tags · label `testId` · step `Arrange:` / `Act:` / `Assert:` · ảnh cuối test (`trang_thai_cuoi_cua_test` khi PASS, `trang_thai_khi_that_bai` khi FAIL, kèm video + trace).

## 5. Cấu trúc project

```text
├── playwright.config.ts        # parallel, reporter, viewport 1920×1080, output → reports/
├── allurerc.mjs                # Allure → reports/allure-report
├── allurerc.single.mjs         # Allure 1 file → reports/allure-report-single
├── .env.example                # mẫu biến môi trường
├── src/
│   ├── pages/                  # Page Object — locator + hành vi
│   │   ├── base.page.ts        # open · clickWhenReady · fillField · getText · waitForUrl
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── fixtures/
│   │   ├── base.fixture.ts     # page objects + ảnh cuối MỌI test (auto fixture)
│   │   └── auth.fixture.ts     # loggedInDashboard — đã đăng nhập sẵn
│   ├── utils/
│   │   ├── env.config.ts       # đọc .env, báo lỗi rõ khi thiếu biến
│   │   ├── logger.ts           # winston → reports/logs/worker-<n>.log
│   │   ├── report.ts           # setTestMeta(): testId · description · severity · feature
│   │   └── test-data.ts        # data unique + traceable, resolve token trong JSON
│   └── tests/auth/
│       ├── login.spec.ts          # CRM_LOGIN_TC_001, 002
│       ├── login-invalid.spec.ts  # CRM_LOGIN_TC_003–005 (data-driven)
│       └── logout.spec.ts         # CRM_LOGIN_TC_006
├── test-data/login-invalid.json   # data cho test data-driven
├── reports/                    # TOÀN BỘ output (git-ignored)
└── .github/workflows/playwright.yml
```

## 6. Quy ước viết test mới

1. **Locator** chỉ nằm trong Page class, ưu tiên `getByRole` / `getByLabel` — **inspect DOM thật trước**, không đoán.
2. **Test** import `test, expect` từ `@fixtures/base.fixture` (hoặc `@fixtures/auth.fixture` nếu cần đăng nhập sẵn) — ảnh cuối test tự đính kèm.
3. Mỗi test gọi `setTestMeta({ testId, description, severity, feature })` và khai tag qua `{ tag: ['@smoke', '@<module>'] }` — **không** khai tag 2 nơi.
4. Thân test bọc trong `test.step('Arrange: …')` / `'Act: …'` / `'Assert: …'`; method POM dùng `test.step` để sinh sub-step.
5. Assertion luôn kèm message: `expect(locator, 'mô tả kỳ vọng').toBeVisible()`.
6. **Cấm** `waitForTimeout`, `console.log`, data hardcode trùng lặp — dùng `TestData.email('tenTest')`…
7. Test phải **độc lập** — chạy song song 5 luồng mà đỏ là test sai, sửa test chứ không hạ `WORKERS`.
8. Tên file: `kebab-case.spec.ts` · Page: `<ten>.page.ts` · tên test Tiếng Việt mô tả hành vi.

Import alias (khai trong `tsconfig.json`): `@pages/*` · `@fixtures/*` · `@utils/*` · `@test-data/*`.

## 7. CI — GitHub Actions

Workflow chạy khi `push` lên `main`, mở `pull_request`, hoặc bấm tay (`workflow_dispatch`): headless · parallel · sinh Allure bằng CLI trong project · upload **1 artifact** `test-reports` (thư mục `reports/`, kể cả khi fail).

Khai 3 secret trong **Settings → Secrets and variables → Actions**: `BASE_URL` · `TEST_USERNAME` · `TEST_PASSWORD`.

> Runner GitHub-hosted mặc định 2 vCPU — nếu chạy chập chờn, hạ `WORKERS` trong workflow xuống 2–3.

## 8. Ghi chú về hệ thống đang test

- Đây là **môi trường demo công khai, dùng chung** — dữ liệu có thể bị người khác sửa bất cứ lúc nào. Test mẫu chỉ **đọc** / đăng nhập, không tạo hay sửa dữ liệu.
- Các test dùng chung 1 tài khoản admin nhưng mỗi test một browser context riêng → session độc lập, đăng xuất ở test này không ảnh hưởng test khác (đã kiểm chứng chạy 5 luồng).
- TC ID `CRM_LOGIN_TC_001–006` là **mã mẫu** — khi có bộ manual TC trong `docs/testcases/login/`, đối chiếu và đổi theo đúng mã ở đó.
