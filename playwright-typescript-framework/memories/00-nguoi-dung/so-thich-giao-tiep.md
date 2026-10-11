---
name: so-thich-giao-tiep
description: Cách người dùng muốn được trả lời — luôn Tiếng Việt, ngắn gọn, có căn cứ; đưa lệnh theo cú pháp PowerShell
type: user
updated: 11-10-2026
nguon: ~/.claude/projects/C--Users-livermore/memory/reply-in-vietnamese.md + các phiên 20-09 → 11-10-2026
---

# Sở thích giao tiếp của người dùng

## Ngôn ngữ
- **Luôn trả lời bằng Tiếng Việt**, kể cả giải thích kỹ thuật và tóm tắt cuối. Tên file, mã, lệnh giữ nguyên.
- **Why:** 02-10-2026 người dùng nhắc "hãy dùng tiếng việt" khi agent lỡ trả lời tiếng Anh.
- Ngày tháng viết dạng `DD-MM-YYYY`.

## Phong cách
- Ngắn gọn, rõ ràng; giải thích lỗi phải có căn cứ trực tiếp (log, output thật), không suy đoán.
- Khi lỗi do agent (lệnh sai, quên bước) → nhận thẳng là lỗi của mình, nêu cách sửa.
- Người dùng hay gửi **ảnh chụp màn hình terminal** để hỏi lỗi → đọc kỹ ảnh: đang đứng thư mục nào, terminal mới hay cũ, lệnh gõ chính xác là gì.

## Môi trường của người dùng
- Windows 11, gõ lệnh trong **terminal của VS Code = Windows PowerShell 5.1**.
- Hay mở workspace ở thư mục cha → dễ đứng sai thư mục khi chạy `npm run ...`.
- Xem chi tiết các bẫy lệnh: [[powershell-va-terminal-vscode]].

## Cách đưa lệnh cho người dùng
- Mỗi lệnh một code block riêng, **không nối bằng `&&`** (PowerShell 5.1 không hỗ trợ).
- Ưu tiên `npm run <script>` thay vì lệnh `npx ...` dài — nếu chưa có script thì **thêm script vào `package.json`** rồi mới đưa lệnh.
- Ghi rõ "chạy trong thư mục gốc framework".
