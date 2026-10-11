# Playwright TypeScript Framework — AnhTester Book (Web UI + API)

Framework automation cho hệ thống **AnhTester Book**:

- Web UI: <https://book.anhtester.com>
- API: <https://book.anhtester.com/swagger> (spec OpenAPI 3.0: `/swagger/json`)

Stack: **Playwright Test + TypeScript** · **Allure Report 2** (CLI nằm trong `node_modules`) · Playwright HTML report · **GitHub Actions**.

> ⚠️ **Allure 2 cần Java.** Gói `allure-commandline` được cài vào project khi chạy `npm install`, nên máy **không cần cài Allure**. Nhưng CLI Allure 2 chạy trên JVM, nên máy muốn sinh/mở report Allure phải có **JRE 8+** (khuyến nghị Temurin 21) trong `PATH` hoặc đã đặt `JAVA_HOME`. Chạy test **không** cần Java. Máy không có Java xem mục [Máy không có Java](#máy-không-có-java).

---

## 1. Yêu cầu

| Thành phần | Phiên bản | Dùng cho |
|---|---|---|
| Node.js | ≥ 20 | Chạy test |
| JRE / JDK | ≥ 8 | **Chỉ** để sinh/mở Allure report |

## 2. Cài đặt

```bash
npm install
npx playwright install firefox   # Chrome & Edge dùng bản đã cài trên máy (channel)
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
```

`.env` **không** chứa tài khoản: fixture tự đăng ký tài khoản unique qua `POST /api/register` cho từng worker (xem [Tài khoản test](#6-tài-khoản-test)).

## 3. Chạy test

```bash
npm test                    # API → Chrome → Edge → Firefox, mỗi lượt song song 5 luồng
npm run test:ui             # chỉ Web UI: Chrome → Edge → Firefox (tuần tự)
npm run test:chrome         # UI chỉ trên Chrome   (tương tự test:edge, test:firefox)
npm run test:api            # chỉ API
npm run test:headed         # UI 3 trình duyệt, ép mở browser thật để debug
npm run test:visual         # Playwright UI Mode — giao diện chọn test, xem từng bước, time-travel DOM
npm run test:debug          # Playwright Inspector trên Chrome — chạy từng bước một
npm run test:smoke          # chỉ test gắn tag @smoke
npm run test:account        # chỉ test tự đăng ký tài khoản (@account)
npm run test:no-account     # bỏ các test tự tạo tài khoản
```

> ⚠️ **PowerShell:** `@` là ký tự đặc biệt (splatting) → gõ tag trực tiếp phải **đặt trong nháy**:
> `npx playwright test --grep "@smoke"`. Không có nháy sẽ báo lỗi `The variable '$smoke' cannot be retrieved`.
> Các script `npm run test:*` ở trên không bị ảnh hưởng.

### Chạy đa trình duyệt — tuần tự từng trình duyệt, song song trong mỗi trình duyệt

| Project | Trình duyệt | Ghi chú |
|---|---|---|
| `ui-chrome` | Google Chrome cài trên máy (`channel: 'chrome'`) | |
| `ui-edge` | Microsoft Edge cài trên máy (`channel: 'msedge'`) | |
| `ui-firefox` | Firefox build của Playwright | Tắt `widget.windows.window_occlusion_tracking` — headed nhiều cửa sổ chồng nhau thì click bị treo |
| `api` | — | Không mở trình duyệt |

`scripts/run-browsers.mjs` gọi `playwright test --project=<x>` **lần lượt** cho từng project; trong mỗi lượt vẫn song song `WORKERS` luồng.

- Trình duyệt trước FAIL thì trình duyệt sau **vẫn chạy**. Cuối lượt in bảng tổng kết và trả exit code 1 nếu có lượt FAIL.
- Allure gom kết quả cả 3 trình duyệt vào **một** report: lượt đầu dọn `allure-results`, các lượt sau cộng dồn. Mỗi test hiện kèm tham số `Project` để phân biệt trình duyệt.
- Playwright HTML report tách theo trình duyệt: `reports/html/<project>/`.

```bash
node scripts/run-browsers.mjs ui-edge ui-firefox         # chọn trình duyệt
npm run test:ui -- --grep "@smoke"                       # thêm tham số cho playwright test
```

> Không dùng `dependencies` giữa các project: một test fail ở Chrome sẽ làm **skip** toàn bộ Edge/Firefox.

### Đổi số luồng song song — đúng 1 chỗ

Parallel **luôn bật** (`fullyParallel: true`), mặc định **5 luồng**. Đổi bằng biến `WORKERS`:

```bash
# Cố định cho máy mình: sửa WORKERS trong .env
# Một lần chạy:
npx cross-env WORKERS=2 playwright test
```

CI: sửa dòng `WORKERS:` ở `.github/workflows/playwright.yml`. **Không** sửa `playwright.config.ts`.

> Test đỏ khi chạy song song là **test sai** (dùng chung dữ liệu, phụ thuộc thứ tự). Hãy sửa test, **đừng** hạ `WORKERS=1` để che lỗi.

### Headed / Headless

| Biến `HEADLESS` | Chế độ | Khi nào |
|---|---|---|
| `false` (mặc định trong `.env.example`) | Mở browser thật | Debug local |
| `true` | Headless | CI (workflow đặt sẵn) |

Viewport tự đổi theo chế độ: headed `1600×770` (vừa cửa sổ trên màn hình 1920×1080) · headless `1920×1080`.

## 4. Mở report

Toàn bộ output nằm trong `reports/` (đã `.gitignore`):

```text
reports/
├── allure-results/         # raw results — input cho Allure
├── allure-report/          # Allure HTML (nhiều file)
├── allure-report-single/   # Allure gộp 1 file — tiện gửi chat/email
├── html/<project>/         # Playwright HTML report từng trình duyệt
├── logs/                   # test-execution.log (winston)
└── test-artifacts/<project>/  # trace, video khi test fail — tách theo trình duyệt
```

| Lệnh | Việc | Cần Java? |
|---|---|---|
| `npm run report` | Sinh + mở Allure report | ✅ |
| `npm run report:generate` | Chỉ sinh `reports/allure-report` | ✅ |
| `npm run report:single` | Sinh 1 file `reports/allure-report-single/index.html` | ✅ |
| `npm run report:html -- reports/html/ui-edge` | Mở Playwright HTML report của một trình duyệt | ❌ |

Gõ CLI trực tiếp thì dùng `npx allure ...` — gọi đúng bản trong `node_modules`, không cần cài Allure lên máy.

### Máy không có Java

- **Xem kết quả ngay:** `npm run report:html -- reports/html/ui-chrome` (Playwright HTML report, cùng dữ liệu, không cần Java).
- **Xem Allure:** nhờ máy có Java (hoặc tải artifact `test-reports` của GitHub Actions) chạy `npm run report:single` rồi mở file `reports/allure-report-single/index.html` bằng browser.
- ⚠️ Report chứa ảnh chụp hệ thống thật — kiểm nội dung trước khi gửi ra ngoài team.

## 5. Cấu trúc project

```text
playwright-typescript-framework/
├── playwright.config.ts        # 4 project: ui-chrome · ui-edge · ui-firefox · api (không mở browser)
├── .env.example                # BASE_URL, API_BASE_URL, HEADLESS, WORKERS, TIMEOUT, LOG_LEVEL
├── src/
│   ├── api/                    # API client — mỗi nhóm endpoint 1 class
│   │   ├── base.api.ts         # send(): step Allure + attach request/response đã che bí mật
│   │   ├── auth.api.ts · book.api.ts · category.api.ts · address.api.ts
│   ├── pages/                  # Page Object
│   │   ├── base.page.ts        # open() · fillField() · clickWhenReady() — bọc test.step, smart wait
│   │   ├── sign-in.page.ts · sign-up.page.ts
│   │   ├── crm/                # crm-admin-login.page.ts · crm-client-login.page.ts (Perfex CRM)
│   ├── fixtures/
│   │   ├── api.fixture.ts      # API client · workerAccount · cleanup
│   │   └── ui.fixture.ts       # Page Object + ảnh cuối MỌI test UI (kế thừa api.fixture)
│   ├── utils/
│   │   ├── env.config.ts       # Đọc .env, export config có kiểu
│   │   ├── logger.ts           # winston → reports/logs/ (không in ra console)
│   │   ├── report.ts           # setTestMeta() · maskSecrets()
│   │   └── test-data.ts        # Sinh data unique + traceable
│   └── tests/
│       ├── ui/auth/            # sign-in.spec.ts · sign-up.spec.ts (AnhTester Book)
│       ├── ui/crm/             # crm-login.spec.ts — Perfex CRM, CRM_LOGIN_TC_011 → 020
│       └── api/                # auth · book · address
├── scripts/run-browsers.mjs     # Chạy tuần tự Chrome → Edge → Firefox, mỗi lượt song song WORKERS luồng
├── test-data/                  # Data-driven: sign-in-invalid.json · sign-up-invalid.json
└── .github/workflows/playwright.yml
```

## 6. Tài khoản test

- Fixture worker `workerAccount` (`src/fixtures/api.fixture.ts`) **tự đăng ký 1 tài khoản riêng cho mỗi worker** rồi đăng nhập lấy token → 5 luồng không dùng chung tài khoản.
- Email dạng `auto_worker<N>_<YYYYMMDDHHmmss>_<rand>@auto.test` — nhìn là biết lần chạy nào tạo ra.
- Mật khẩu sinh ngẫu nhiên, chỉ sống trong bộ nhớ, **không** ghi ra file hay report (`maskSecrets` che `password`/`accessToken`/`Authorization` trong attachment).
- Test cần tài khoản gắn tag **`@account`**. Chỉ fixture nào được dùng mới được khởi tạo, nên test không cần tài khoản sẽ không tạo tài khoản nào.
- Dữ liệu test tự tạo (danh mục, sách) được dọn qua fixture `cleanup` — chạy cả khi test FAIL.

## 7. Quy ước

### Viết test mới

```typescript
test('Tên test Tiếng Việt mô tả hành vi', { tag: ['@smoke', '@book', '@api'] }, async ({ bookApi }) => {
  await setTestMeta({ testId: 'BOOK_BOOK_TC_006', feature: 'Sách', severity: 'normal', description: '...' });

  await test.step('Arrange: ...', async () => { /* dựng tiền đề */ });
  const res = await test.step('Act: ...', async () => bookApi.list());
  await test.step('Assert: ...', async () => { expect(res.status, 'message rõ ràng').toBe(200); });
});
```

| Mục | Quy ước |
|---|---|
| Tên test | Tiếng Việt, mô tả hành vi — không phải tên hàm |
| Metadata | `setTestMeta()` đủ `testId` · `feature` · `severity` · `description` |
| Tags | Khai qua `{ tag: [...] }` của Playwright — allure-playwright tự đọc, **không** khai lại trong Allure |
| TC ID | `BOOK_<MODULE>_TC_<3 số>` — một nghiệp vụ một prefix cho cả UI lẫn API (`AUTH`, `BOOK`, `ADDRESS`…) |
| Step | `Arrange:` / `Act:` / `Assert:` — method POM/API tự sinh sub-step |
| Locator | Chỉ trong Page class, ưu tiên `getByRole` / `getByLabel`. Verify trên DOM thật trước khi dùng |
| Chờ | Chỉ smart wait (`expect(...)`, auto-waiting). **Cấm** `waitForTimeout` |
| Log | `logger` (winston). **Cấm** `console.log` — sẽ thành attachment `stdout` trong Allure |
| Test data | `TestData.*` — không hardcode email/username/mã |
| File | Page: `<tên>.page.ts` · API: `<tên>.api.ts` · Test: `<tên>.spec.ts` / `<tên>.api.spec.ts` |

### Evidence

- Test UI: fixture tự đính ảnh `trang_thai_cuoi_cua_test` (PASS) / `trang_thai_khi_that_bai` (FAIL) cho **mọi** test.
- Test API: không có màn hình → mỗi request đính kèm JSON `request/response` (đã che bí mật) làm bằng chứng.

## 8. CI/CD — GitHub Actions

`.github/workflows/playwright.yml`: chạy khi `push` lên `main`, `pull_request`, hoặc chạy tay (`workflow_dispatch`, chọn `all`/`ui`/`api`).

- Headless, song song `WORKERS` (khai ở `env:` cấp workflow)
- Cài Temurin JRE 21 cho Allure 2, sinh report bằng CLI trong project
- Upload **1 artifact** `test-reports` = cả thư mục `reports/`, kể cả khi test fail
- `BASE_URL` / `API_BASE_URL` lấy từ **Repository variables** (không bắt buộc, có mặc định). Không cần secret đăng nhập

> Workflow đặt ở `.github/workflows/` **của thư mục này** — dùng khi framework là repo riêng. Nếu giữ trong repo cha, chuyển file ra `.github/workflows/` ở gốc repo cha và thêm `defaults.run.working-directory: playwright-typescript-framework` + `cache-dependency-path: playwright-typescript-framework/package-lock.json`.

## 9. Ghi chú về hệ thống đang test

Hành vi đã kiểm chứng bằng request thật (29-09-2026), khác hoặc chưa ghi rõ trong spec:

- `GET /api/address/<tên không tồn tại>` trả **200 `[]`**, không trả 4xx.
- `POST /api/book` chỉ trả `msg`, **không** trả `id` → `BookApi.findByName()` tra lại theo tên.
- 🐞 **Known issue:** `POST /api/book` trả **200** trong khi Swagger khai **201** → `BOOK_BOOK_TC_005` FAIL có chủ đích (giữ assertion theo spec, dạng `expect.soft`). Bug: `docs/bugs/book/api/BUG_book_1790690300_TC005.md` (ở repo cha).
- Form Web chỉ validate khi bấm submit (không validate lúc rời ô); thông báo lỗi gắn với ô qua `aria-describedby` → assert bằng `toHaveAccessibleDescription`.

### Perfex CRM — `https://crm.anhtester.com` (thêm 11-10-2026)

- Bộ TC: `docs/testcases/test_cases_login_web.md`. Đã automate `CRM_LOGIN_TC_011` → `020` tại `src/tests/ui/crm/crm-login.spec.ts`, dữ liệu biến thể ở `test-data/crm-login-invalid.json`.
- Tài khoản đọc từ `.env` theo đúng tên biến trong TC: `ADMIN_PASSWORD`, `CUSTOMER_EMAIL`/`CUSTOMER_PASSWORD`, `TC014_EMAIL`/`TC014_PASSWORD` (xem `.env.example`). Thiếu biến nào thì test cần biến đó **SKIP** kèm lý do.
- POST `/admin/authentication` trả **303** rồi chuyển hướng (GET 200) → `CrmAdminLoginPage.submit()` trả về phản hồi **cuối** của chuỗi chuyển hướng.
- Dải báo lỗi `.alert.alert-danger` không có vai trò trợ năng → dùng CSS.
- 🐞 **Known issue:** `CRM_LOGIN_TC_016` FAIL có chủ đích — sau khi đăng nhập lỗi ô Email trở về rỗng (AMB-LOGIN-10, PO xác nhận là lỗi).
- Firefox coi Email toàn khoảng trắng là không hợp lệ (Chrome/Edge thì không) → `TC_011-d` skip trên Firefox.
- Firefox **headed** chạy song song thỉnh thoảng treo khi đóng context (~1/5 lượt) → đã tắt video cho `ui-firefox`. Headless không bị.
