---
name: git-env-va-bao-mat
description: Cấm lệnh git đổi trạng thái code, được đọc .env để lấy tài khoản, không bao giờ in mật khẩu/token ra log/report/Slack
type: feedback
updated: 11-10-2026
nguon: C:\ai-test-automation\CLAUDE.md (Git Pull Restriction, .env)
---

# Git, `.env` và bảo mật

## Git
- **Cấm** `git pull`, `git checkout`, `git merge`, `git rebase`, `git reset` và mọi lệnh đổi nhánh/ghi đè code local.
- **Được** dùng read-only: `git status`, `git diff`, `git log`.
- **Why:** code trên server có thể cũ hơn local; pull về sẽ ghi đè phần đang sửa.
- Cần file mới → hỏi người dùng cung cấp.
- (11-10-2026) Repo này chưa `git init`.

## `.env`
- Người dùng **cho phép** agent đọc `.env` để lấy tài khoản, mật khẩu, token… phục vụ chạy test. Chỉ đọc để dùng, không ghi ra log, không hiển thị.
- `.env` đã `.gitignore`. `.env.example` là mẫu (không chứa tài khoản) — biến: `BASE_URL`, `API_BASE_URL`, `HEADLESS`, `WORKERS`, `TIMEOUT`, `LOG_LEVEL` (+ nội bộ: `HTML_REPORT_DIR`, `KEEP_ALLURE_RESULTS` do `scripts/run-browsers.mjs` đặt).
- Mọi nơi đọc cấu hình qua `env` trong `src/utils/env.config.ts`, **không** đọc `process.env` trực tiếp.

## Bí mật
- Không ghi mật khẩu/token/dữ liệu khách hàng vào report, log, chat, Slack.
- Che bằng `maskSecrets()` (khóa: `password`, `password_confirmation`, `accessToken`, `refetchToken`, `authorization`, `token`).
- Agent **không tự tạo tài khoản / nhập mật khẩu** trên site bên ngoài khi debug bằng MCP → nhờ người dùng thao tác (lý do happy path UI đang treo, xem [[tong-quan-du-an]]). Test automation thì fixture tự đăng ký tài khoản qua API — xem [[tai-khoan-va-du-lieu-test]].
- Report chứa ảnh hệ thống thật → kiểm nội dung trước khi gửi ra ngoài team.
