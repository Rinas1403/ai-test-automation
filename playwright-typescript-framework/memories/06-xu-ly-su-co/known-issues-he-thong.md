---
name: known-issues-he-thong
description: Bug và hành vi lạ đã xác nhận của AnhTester Book (POST /api/book 200≠201, address 200 [], toast mẫu) và cách automation xử lý
type: project
updated: 11-10-2026
---

# Known issues của hệ thống đang test

## 🐞 BUG_book_1790690300_TC005 — `POST /api/book` trả 200 thay vì 201
- Severity Minor · P3 · nền tảng API · phát hiện 29-09-2026, tái hiện 3/3.
- File bug: `C:\ai-test-automation\docs\bugs\book\api\BUG_book_1790690300_TC005.md` (ở repo cha, có danh mục `docs/bugs/README.md`). Repo này chưa có `docs/bugs/` — khi lập bug mới cho repo này, hỏi người dùng nên đặt ở đâu.
- Expected 201 (Swagger không khai 200; các endpoint tạo mới khác trả 201). Actual 200 `{"msg":"Book created successfully."}`, sách vẫn được tạo.
- Automation: `BOOK_BOOK_TC_005` giữ `expect.soft(...).toBe(201)` → **FAIL có chủ đích** đến khi dev sửa; các bước xem/xoá phía sau vẫn chạy. **Không hạ về 200.**
- Lịch sử: bản 20-09 từng assert theo hành vi thật (200) kèm ghi chú; bản 29-09 người dùng chọn assert theo spec + lập bug. Giữ cách hiện tại.
- Khi báo cáo kết quả `npm test` luôn nêu TC này là FAIL do bug có sẵn, không phải lỗi mới.
- Retest bằng `/retest-fixed-bugs` (workflow ở repo cha) → ghi vào bảng "Lịch sử retest" của file bug.

## 🐞 Perfex CRM — `CRM_LOGIN_TC_016`: ô Email bị xoá sau khi đăng nhập lỗi
- PO xác nhận là lỗi (`AMB-LOGIN-10`); file TC ghi rõ "FAIL là kết quả đúng — mở bug, KHÔNG sửa TC".
- Đã đo 11-10-2026: ô Email rỗng, HTML máy chủ trả không có `value` ở `input#email`. Test FAIL trên cả 3 trình duyệt → đúng như mong đợi.
- **Chưa lập bug report** (chưa có thư mục `docs/bugs/` trong repo này) → đề xuất `/create-bug-report` khi người dùng đồng ý.
- 2 TC khác của bộ CRM được TC ghi là chắc chắn FAIL: `TC_028` (Quên mật khẩu bỏ trống email trả `Email not found`), `TC_039` (HTTP không ép sang HTTPS) — chưa automate.

## Hành vi lạ (không phải bug đã lập)
- `PATCH /api/book/{id}` được Swagger khai trả 201 — bất thường, cần rà khi viết test update.
- `GET /api/address/<không tồn tại>` → 200 `[]`.
- Toast lỗi đăng nhập Web hiện chữ mẫu `This is an info Alert.` → không dùng làm assertion.
- Trang Book Management (Web, sau đăng nhập): ô tìm kiếm `visibility: hidden` cho tới khi bấm **Filter** (quan sát 20-09-2026).
