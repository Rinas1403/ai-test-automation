---
name: allure-report-van-hanh
description: Cách sinh/mở Allure 2 trong repo — cần Java, lỗi JAVA_HOME ở terminal VS Code cũ, giữ biểu đồ Trend, khoá thư mục reports/, file:// không mở được report nhiều file
type: reference
updated: 11-10-2026
nguon: phiên b43c04c0 (29-09-2026) + 2102bd06 (25-09-2026, repo cũ C:\source-AI-automation)
---

# Vận hành Allure report

## Lệnh (chạy ở thư mục gốc framework)
| Lệnh | Việc | Cần Java |
|---|---|---|
| `npm run report` | generate + open | ✅ |
| `npm run report:generate` | sinh `reports/allure-report` | ✅ |
| `npm run report:open` | mở report đã sinh (chạy server, giữ terminal) | ✅ |
| `npm run report:single` | 1 file `reports/allure-report-single/index.html` (~10 MB, gửi chat/email được) | ✅ |
| `npm run report:html -- reports/html/ui-chrome` | Playwright HTML report 1 trình duyệt | ❌ |

## Java
- Allure 2 (`allure-commandline` trong `node_modules`) chạy trên JVM → máy phải có **JRE 8+**. Chạy test thì không cần Java.
- Yêu cầu gốc của người dùng: "Allure 2, tích hợp trong repo, không cài môi trường vào máy". Mâu thuẫn với việc cần Java:
  - Bản 20-09 (repo cũ): `npm install` tự tải **JRE Temurin 21 portable** vào `.jre/`, gọi qua `scripts/allure.mjs`.
  - Bản 29-09 (repo này): người dùng chọn **cài JRE lên máy**: `winget install EclipseAdoptium.Temurin.21.JRE --source winget` (thêm `--source winget` để né câu hỏi điều khoản `msstore`). Máy hiện có `openjdk 21.0.12.1`.
- Rule repo cha cấm hướng dẫn cài Allure lên máy (`scoop/brew/choco`), Allure luôn nằm trong project. Gọi CLI bằng `npx allure ...` hoặc `npm run`, **không gõ `allure` trơn** (máy có bản global `AppData\Roaming\npm\allure` dễ gọi nhầm).
- CI: `actions/setup-java@v4` Temurin 21.

## Lỗi `JAVA_HOME is not set` dù đã cài Java
- Terminal VS Code **thừa hưởng biến môi trường từ tiến trình VS Code**; VS Code mở trước khi cài Java thì mở tab terminal mới vẫn là PATH cũ.
- Sửa nhanh trong terminal hiện tại:
  ```powershell
  $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User'); $env:JAVA_HOME = [Environment]::GetEnvironmentVariable('JAVA_HOME','Machine')
  ```
- Sửa hẳn: thoát **toàn bộ** VS Code rồi mở lại.
- Dòng phụ `JAVA_HOME is set to an invalid directory: "= 1>&2"` / `'"""' is not recognized` chỉ là rác do `allure.bat` in khi thiếu Java.

## Kết quả cũ cộng dồn & biểu đồ Trend
- `allure-playwright` ghi thêm vào `allure-results` mà không xoá → report lẫn kết quả cũ / test `skipped` từ UI Mode.
- `src/utils/global-setup.ts` giải quyết: trước mỗi lần chạy **xoá `allure-results`** (retry khi EBUSY/EPERM) và **chép `allure-report/history` → `allure-results/history`** để Trend có dữ liệu.
- Chạy nhiều trình duyệt: chỉ lượt đầu dọn (`KEEP_ALLURE_RESULTS`) — xem [[chay-da-trinh-duyet]].
- Trend cần ≥ 2 lần **sinh report** (chỉ chạy test mà không `report:generate` thì không thêm điểm).
- **Đừng xoá `reports/allure-report`** nếu muốn giữ Trend — lịch sử nằm ở đó.

## Khoá thư mục & mở report
- `allure open` / server preview đang chạy sẽ **khoá `reports/`** trên Windows → xoá/sinh lại lỗi `EPERM`. Bảo người dùng Ctrl+C tắt server trước. Không tự kill tiến trình của người dùng.
- Report nhiều file mở bằng `file:///` → "Failed to Load Page" (trình duyệt chặn tải dữ liệu). Phải mở qua server (`report:open`) hoặc dùng bản `report:single`.
- Nếu tab report còn mở thì sinh lại xong chỉ cần F5.
