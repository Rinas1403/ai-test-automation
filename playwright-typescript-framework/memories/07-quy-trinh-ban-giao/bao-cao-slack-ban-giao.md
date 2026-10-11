---
name: bao-cao-slack-ban-giao
description: Bàn giao xong là TỰ gửi báo cáo lên Slack #project-crm không hỏi lại, theo mẫu bắt buộc (bảng TC Headed/Headless, Tổng, Stack/POM/Report, Known issues, Bước tiếp theo)
type: feedback
updated: 11-10-2026
nguon: ~/.claude/projects/C--ai-test-automation/memory/slack-handover-report-format.md + C--AI-test-manual1/memory/slack-report-format.md + CLAUDE.md repo cha
---

# Báo cáo bàn giao lên Slack

## Khi nào gửi
- **Mọi lần bàn giao** (kể cả thay đổi cấu hình chạy: đa trình duyệt, workers…) → gửi `#project-crm` (channel ID `C0C8E9GNGTE`, workspace `tester-knm4166`) bằng `slack_send_message`.
- **Gửi ngay, không hỏi lại.** **Why:** 11-10-2026 agent hỏi "có muốn gửi Slack không?" sau khi xong đa trình duyệt → người dùng phàn nàn "ủa tại sao bạn không báo cho tôi bên slack". CLAUDE.md đã quy định sẵn.
- Người dùng muốn thay bản đã gửi → gửi bản mới thay thế (bản cũ cần người dùng tự xoá nếu tool không hỗ trợ xoá).

## Mẫu bắt buộc
**Why:** người dùng đưa ảnh mẫu 11-10-2026, chê bản tóm tắt ngắn (chỉ bảng PASS/FAIL) là chưa rõ; người đọc Slack phải thấy ngay hệ thống nào, TC nào, chạy chế độ nào, code ở đâu, rủi ro gì, việc tiếp theo.

```
📋 **Bàn giao: <việc đã làm> (<DD-MM-YYYY>)**
**Hệ thống:** <tên hệ thống + version nếu biết> — `<host>` (<ngữ cảnh: namespace/module…>)

✅ **Kết quả automation**
| TC ID | Tên test | Severity | Headed | Headless |
|---|---|---|---|---|
| `BOOK_AUTH_TC_004` | <tên test Tiếng Việt> | normal | PASS (3.0s) | PASS (2.1s) |

**Tổng: X PASS · Y FAIL · Z SKIP**
• **Stack:** Playwright TypeScript + Allure 2 (framework `playwright-typescript-framework`, project `<ui-chrome…>`, lệnh `npm run …`)
• **POM:** `<PageClass>` · `<fixture>` — locator verify trên DOM thật
• **Report:** đủ metadata + step Arrange/Act/Assert + ảnh cuối test, mật khẩu đã che, không có stdout
• **Credentials** nằm ở `.env` (không commit)

🗺️ **<Workstream khác nếu có> — <trạng thái>**
• <phát hiện chính>

⚠️ **Known issues / cần lưu ý**
• <vấn đề + tác động + việc cần làm>

▶️ **Bước tiếp theo**
<việc kế tiếp → lệnh/workflow sẽ chạy>
```

## Quy tắc điền
- Tiếng Việt, ngày `DD-MM-YYYY`, **không** ghi mật khẩu/token/dữ liệu khách hàng.
- Cột Headed/Headless: thời gian lấy từ output thật; chế độ chưa chạy ghi `—`, không bịa số. Chạy nhiều trình duyệt → tách cột theo trình duyệt.
- Bỏ hẳn section không có nội dung, không để section rỗng.
- Lỗi môi trường đã xử lý (VD thiếu browser Firefox) đưa vào ⚠️ kèm cách đã xử lý.
- Báo cáo chạy `npm test` phải nêu `BOOK_BOOK_TC_005` FAIL do bug có sẵn ([[known-issues-he-thong]]).
