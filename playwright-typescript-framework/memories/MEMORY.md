# MEMORY.md — Bản đồ bộ nhớ của repo

> Đọc file này **ngay sau `CLAUDE.md`**, trước khi bắt tay vào bất kỳ yêu cầu nào.
> File này chỉ là **bản đồ**: tra bảng "Khi làm việc X" để biết phải mở file nhớ nào, rồi đọc đúng các file đó. Không cần đọc hết mọi file.

## 1. Khi làm việc X → đọc những file nào

| Yêu cầu của người dùng | Bắt buộc đọc |
|---|---|
| **Mọi yêu cầu** | `00-nguoi-dung/so-thich-giao-tiep.md` · `01-du-an/tong-quan-du-an.md` · `02-quy-tac-bat-buoc/definition-of-done.md` |
| Viết / sửa test **UI** (Web) | `03-kien-truc-framework/cau-truc-va-lop-co-so.md` · `02-quy-tac-bat-buoc/trinh-duyet-va-viewport.md` · `02-quy-tac-bat-buoc/quy-tac-report-allure.md` · module tương ứng trong `04-module-nghiep-vu/` · `04-module-nghiep-vu/danh-muc-test-case.md` |
| Viết / sửa test **API** | `03-kien-truc-framework/cau-truc-va-lop-co-so.md` · `03-kien-truc-framework/tai-khoan-va-du-lieu-test.md` · `02-quy-tac-bat-buoc/quy-tac-report-allure.md` · module trong `04-module-nghiep-vu/` · `04-module-nghiep-vu/danh-muc-test-case.md` · `06-xu-ly-su-co/known-issues-he-thong.md` |
| Bất cứ việc gì với **Perfex CRM** (`crm.anhtester.com`, TC `CRM_*`) | `04-module-nghiep-vu/module-crm-login.md` + các file của dòng UI phía trên |
| Thêm module nghiệp vụ mới | như 2 dòng trên + tạo file `04-module-nghiep-vu/module-<ten>.md` mới |
| Đổi cách chạy: trình duyệt, số luồng, headed/headless, CI | `03-kien-truc-framework/chay-da-trinh-duyet.md` · `02-quy-tac-bat-buoc/trinh-duyet-va-viewport.md` |
| Tài khoản test, dữ liệu, dọn dữ liệu | `03-kien-truc-framework/tai-khoan-va-du-lieu-test.md` · `02-quy-tac-bat-buoc/git-env-va-bao-mat.md` |
| Report Allure: sinh/mở, Java, Trend, lỗi | `05-allure-report/allure-report-van-hanh.md` · `02-quy-tac-bat-buoc/quy-tac-report-allure.md` |
| Người dùng báo lỗi khi tự chạy lệnh / gửi ảnh terminal | `06-xu-ly-su-co/powershell-va-terminal-vscode.md` · `05-allure-report/allure-report-van-hanh.md` |
| Test FAIL, nghi bug hệ thống | `06-xu-ly-su-co/known-issues-he-thong.md` · `02-quy-tac-bat-buoc/definition-of-done.md` (mục "không hạ assertion") |
| Đụng tới git, `.env`, mật khẩu, token | `02-quy-tac-bat-buoc/git-env-va-bao-mat.md` |
| **Bàn giao / báo cáo kết quả** | `07-quy-trinh-ban-giao/bao-cao-slack-ban-giao.md` (tự gửi Slack, không hỏi lại) |
| Hỏi "vì sao code thế này", lịch sử | `01-du-an/lich-su-phien-lam-viec.md` |

## 2. Mục lục

### 00-nguoi-dung — Người dùng
- [so-thich-giao-tiep](00-nguoi-dung/so-thich-giao-tiep.md) — Luôn Tiếng Việt, ngắn gọn có căn cứ; lệnh viết cho PowerShell 5.1, mỗi lệnh một block

### 01-du-an — Dự án
- [tong-quan-du-an](01-du-an/tong-quan-du-an.md) — AnhTester Book Web + API **và Perfex CRM**, nguồn gốc từ repo cha `C:\ai-test-automation`, trạng thái, **việc còn treo**
- [lich-su-phien-lam-viec](01-du-an/lich-su-phien-lam-viec.md) — Nhật ký các phiên 20-09 → 11-10-2026

### 02-quy-tac-bat-buoc — Quy tắc bắt buộc (rút từ CLAUDE.md + `.claude/rules/` của repo cha)
- [definition-of-done](02-quy-tac-bat-buoc/definition-of-done.md) — POM, không đoán locator, PASS 2 lần headed, smart wait, data random, không hạ assertion né bug
- [quy-tac-report-allure](02-quy-tac-bat-buoc/quy-tac-report-allure.md) — 5 metadata, step Arrange/Act/Assert, ảnh cuối mọi test, cấm stdout, che bí mật
- [trinh-duyet-va-viewport](02-quy-tac-bat-buoc/trinh-duyet-va-viewport.md) — Headed 1600×770 / headless 1920×1080, thứ tự debug Playwright MCP
- [git-env-va-bao-mat](02-quy-tac-bat-buoc/git-env-va-bao-mat.md) — Cấm git đổi trạng thái code, được đọc `.env`, không lộ mật khẩu/token

### 03-kien-truc-framework — Kiến trúc
- [cau-truc-va-lop-co-so](03-kien-truc-framework/cau-truc-va-lop-co-so.md) — Bản đồ `src/`, BasePage/BaseApi, fixture, khuôn test chuẩn
- [chay-da-trinh-duyet](03-kien-truc-framework/chay-da-trinh-duyet.md) — Chrome → Edge → Firefox tuần tự × 5 luồng, `run-browsers.mjs`, fix click treo Firefox, **Firefox headed treo khi đóng context (tắt video)**
- [tai-khoan-va-du-lieu-test](03-kien-truc-framework/tai-khoan-va-du-lieu-test.md) — `workerAccount` tự đăng ký, tag `@account`, `TestData`, fixture `cleanup`

### 04-module-nghiep-vu — Module nghiệp vụ
- [danh-muc-test-case](04-module-nghiep-vu/danh-muc-test-case.md) — Sổ TC ID đã dùng + số kế tiếp (**cập nhật mỗi khi thêm test**)
- [module-auth](04-module-nghiep-vu/module-auth.md) — Đăng ký/đăng nhập Web + API, locator đã verify, happy path còn thiếu
- [module-book-va-category](04-module-nghiep-vu/module-book-va-category.md) — API sách & danh mục, không trả id, luồng TC_005
- [module-address](04-module-nghiep-vu/module-address.md) — API tỉnh/thành, phường/xã, trả 200 `[]` khi không tồn tại
- [module-crm-login](04-module-nghiep-vu/module-crm-login.md) — **Hệ thống thứ 2: Perfex CRM** đăng nhập — file TC, locator, POST 303, biến `.env`, TC 011–020

### 05-allure-report — Report
- [allure-report-van-hanh](05-allure-report/allure-report-van-hanh.md) — Cần Java, lỗi JAVA_HOME ở VS Code, giữ Trend, khoá `reports/`, `file://`

### 06-xu-ly-su-co — Sự cố & bug
- [powershell-va-terminal-vscode](06-xu-ly-su-co/powershell-va-terminal-vscode.md) — `@tag` splatting, `&&`, npx/npm, sai thư mục
- [known-issues-he-thong](06-xu-ly-su-co/known-issues-he-thong.md) — Bug `POST /api/book` 200≠201 và hành vi lạ của hệ thống

### 07-quy-trinh-ban-giao — Bàn giao
- [bao-cao-slack-ban-giao](07-quy-trinh-ban-giao/bao-cao-slack-ban-giao.md) — Tự gửi #project-crm ngay khi xong, theo mẫu bắt buộc

## 3. Quy tắc giữ bộ nhớ gọn và đúng

- **Một file = một chủ đề.** File nào vượt ~150 dòng thì tách nhỏ theo chủ đề con, cập nhật bản đồ ở trên.
- **Cập nhật thay vì tạo trùng:** trước khi thêm, tìm file đã có cùng chủ đề. Thông tin sai/cũ → sửa hoặc xoá, đổi `updated:`.
- **Ghi vào đâu:**
  - Người dùng sửa cách làm / dặn "từ nay…" → file `type: feedback` phù hợp (kèm **Why** + **How to apply**).
  - Thêm test → `04-module-nghiep-vu/danh-muc-test-case.md` + file module.
  - Phát hiện hành vi lạ / bug hệ thống → `06-xu-ly-su-co/known-issues-he-thong.md`.
  - Xong một phiên có thay đổi đáng kể → 1 dòng ở `01-du-an/lich-su-phien-lam-viec.md`; việc treo → `01-du-an/tong-quan-du-an.md`.
- **Không ghi:** mật khẩu, token, nội dung `.env`; thứ đã có rõ trong code/README (chỉ ghi điều **không suy ra được** từ code: lý do, quyết định, bẫy, sở thích).
- Ngày tuyệt đối `DD-MM-YYYY`, không viết "hôm qua", "tuần trước".
- File mới phải có frontmatter: `name`, `description` (1 dòng), `type` (`user` | `feedback` | `project` | `reference`), `updated`. Liên kết chéo bằng `[[name]]`.
- Bộ nhớ phản ánh thời điểm ghi — tên file/hàm/flag được nhắc phải **kiểm lại trong code** trước khi dựa vào.
