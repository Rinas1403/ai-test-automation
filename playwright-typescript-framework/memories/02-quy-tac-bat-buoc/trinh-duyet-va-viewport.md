---
name: trinh-duyet-va-viewport
description: Viewport headed 1600x770 / headless 1920x1080, thứ tự debug bằng Playwright MCP, không resize vượt cửa sổ
type: feedback
updated: 11-10-2026
nguon: C:\ai-test-automation\CLAUDE.md (Browser Rules) + phiên 29-09 và 11-10-2026
---

# Trình duyệt & viewport

**Why:** cửa sổ trình duyệt không nở ra sau khi launch; viewport lớn hơn cửa sổ thì phần bên phải trang bị cắt, người dùng không nhìn thấy khi xem test chạy headed.
**How to apply:** không đổi các giá trị này nếu người dùng không yêu cầu; khi nghi trang bị cắt thì đo trước khi sửa.

## Viewport theo chế độ (đã cài trong `playwright.config.ts`)
| Chế độ | Viewport | Ghi chú |
|---|---|---|
| Headed (`HEADLESS=false`, mặc định `.env`) | `1600×770` | Vừa cửa sổ trên màn hình 1920×1080 (khung chiếm +135 dọc, +14…17 ngang) |
| Headless (CI) | `1920×1080` | |

## Debug UI bằng Playwright MCP
- Thứ tự bắt buộc: `navigate → (kiểm viewport) → wait_for(load) → snapshot → interact → screenshot(khi fail)`.
- Không `browser_navigate` lại khi đã ở đúng trang. **Không `browser_resize`** để phóng viewport vượt cửa sổ.
- Đo: `browser_evaluate: () => ({ inner:[innerWidth,innerHeight], outer:[outerWidth,outerHeight] })` — `inner` > `outer` là đang bị cắt.
- Viewport của MCP chỉnh ở `--viewport-size` trong `.mcp.json` (repo cha đang để `1600,780`); phải khởi động lại Claude Code. Đã từng gặp inner 1600 > cửa sổ 1554 → gợi ý hạ còn `1537,750`.
- Dùng `snapshot` để lấy locator, `screenshot` chỉ khi fail/milestone.

## Đặc thù từng trình duyệt
- Xem [[chay-da-trinh-duyet]] (Chrome/Edge dùng bản cài trên máy qua `channel`, Firefox phải tắt occlusion tracking).
