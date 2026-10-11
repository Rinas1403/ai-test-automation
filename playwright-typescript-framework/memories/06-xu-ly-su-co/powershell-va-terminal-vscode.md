---
name: powershell-va-terminal-vscode
description: Các bẫy khi người dùng chạy lệnh trong PowerShell 5.1 của VS Code — @tag bị splatting, && không hỗ trợ, npx vs npm, sai thư mục, chữ đỏ NativeCommandError
type: feedback
updated: 11-10-2026
nguon: phiên 0ce62978 (20-09), b43c04c0 (29-09), 2102bd06 (25-09-2026)
---

# PowerShell & terminal VS Code

**Why:** người dùng đã nhiều lần chạy lệnh agent đưa và bị lỗi vì lệnh viết theo cú pháp bash; mỗi lần đều là lỗi của agent.
**How to apply:** mọi lệnh đưa cho người dùng phải chạy được nguyên văn trong Windows PowerShell 5.1.

| Bẫy | Triệu chứng | Cách đúng |
|---|---|---|
| `@` là splatting | `npx playwright test --grep @account` → `The variable '$account' cannot be retrieved` | Đặt trong nháy `--grep "@account"` hoặc dùng `npm run test:account` / `test:smoke` / `test:no-account` |
| `&&` không có trong PS 5.1 | `The token '&&' is not a valid statement separator` | Mỗi lệnh một dòng/một code block. (`&&` **bên trong** script npm thì vẫn chạy vì npm dùng `cmd.exe`) |
| `npx run report` | npx đi tìm chương trình tên `run` | `npm run report` |
| Sai thư mục | `npm run ...` không thấy `package.json` | Nhắc rõ đứng ở thư mục gốc framework (`C:\playwright-typescript-framework`) |
| Nối test + report | `npm test && npm run report` dừng khi có test FAIL (VD TC_005) → không sinh report | Gõ riêng từng lệnh |
| Chữ đỏ `NativeCommandError` | PowerShell tô đỏ mọi thứ in ra stderr (VD `java -version`) | Không phải lỗi |
| Script chưa tồn tại | `npm run test:crm` → missing script | Thêm script vào `package.json` trước khi đưa lệnh; kiểm bằng `npm run` |

## Xem test trực quan
- `npm run test:visual` (Playwright UI Mode — khuyên dùng, lọc `@account` trong ô filter không vướng lỗi `@`).
- `npm run test:headed`, `npm run test:debug` (Inspector, Chrome).
- Extension **Playwright Test for VSCode**: phải mở đúng thư mục framework làm workspace (hoặc chọn đúng `playwright.config.ts`), nếu không extension không thấy test.
- Xem script test ở đâu: `src/tests/...` — hướng dẫn Ctrl+P gõ tên file.
