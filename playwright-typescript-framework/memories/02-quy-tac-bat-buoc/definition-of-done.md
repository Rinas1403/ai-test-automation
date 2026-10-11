---
name: definition-of-done
description: Điều kiện bàn giao bắt buộc cho mọi test/code automation — POM, smart wait, chạy PASS 2 lần headed, cleanup, data random
type: feedback
updated: 11-10-2026
nguon: C:\ai-test-automation\CLAUDE.md (mục Cleanup & Delivery, 2, 7, 8, 9) + .claude/rules/automation_rules.md, locator_strategy.md
---

# Definition of Done (rút gọn từ CLAUDE.md của repo cha)

**Why:** đây là luật của dự án, người dùng sẽ kiểm theo từng mục; thiếu mục nào = chưa xong.
**How to apply:** trước khi báo "xong", tự rà đủ checklist dưới đây và nêu rõ mục nào chưa đạt.

## Quy trình làm việc
1. **Recon:** inspect DOM thật (Playwright MCP, headed) trước khi viết code. **Không đoán locator**, không copy locator cũ mà không verify lại.
2. **Implement:** giữ POM — Page (locator + thao tác) · Test (assertion) · Utils/Test data tách riêng. Assertion chỉ nằm trong test.
3. **Chạy ngay → tự sửa:** FAIL thì đọc log, tìm root cause, sửa, chạy lại đến khi PASS ổn định. Chỉ hỏi người dùng khi business rule mâu thuẫn.
4. **Cleanup** rồi mới bàn giao.

## Checklist
- **Code:** không `console.log` (thành `stdout` trong Allure — dùng `logger`), không code comment-out, không locator/import thừa, **không `waitForTimeout`**.
- **Locator:** ưu tiên `getByRole`/`getByLabel` → `data-testid` → `id`/`name` → CSS → XPath (cuối cùng). Cấm class hash động, ID tự sinh (VD MUI `_r_g_`), `nth-child`, XPath tuyệt đối. Locator phải match đúng 1 element.
- **Chất lượng:** PASS **2 lần liên tiếp ở headed**; headless chỉ chạy sau khi headed PASS. Mỗi test độc lập, không phụ thuộc thứ tự. Assertion có message rõ ràng.
- **Test data:** trường unique phải random + traceable (`auto_<testName>_<timestamp>_<rand>`), dùng `TestData.*` — xem [[tai-khoan-va-du-lieu-test]].
- **Parallel là mặc định (5 luồng).** Test đỏ khi chạy song song = test sai → sửa test, **không** hạ `WORKERS=1` để che.
- **Report:** đạt [[quy-tac-report-allure]].
- **File:** đúng thư mục theo kiến trúc, không file tạm; `.env` không commit, không chứa credentials thật trong config.
- **Báo cáo:** số PASS/FAIL/SKIP, TC nào làm/skip (lý do), known issues → rồi gửi Slack theo [[bao-cao-slack-ban-giao]].

## Không được hạ assertion để né bug app
- Hệ thống sai spec → giữ assertion theo spec (có thể dùng `expect.soft` để các bước sau vẫn chạy), lập bug report. **Không** nới thành `2xx` hay sửa theo hành vi sai. Ví dụ: [[known-issues-he-thong]] (`BOOK_BOOK_TC_005`).
