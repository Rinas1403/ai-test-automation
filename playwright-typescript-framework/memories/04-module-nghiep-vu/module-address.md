---
name: module-address
description: Module ADDRESS (API tỉnh/thành, phường/xã) — endpoint và hành vi trả 200 [] khi tên không tồn tại
type: project
updated: 11-10-2026
---

# Module ADDRESS (API)

Prefix TC: `BOOK_ADDRESS_TC_nnn`. Không cần token.

## `AddressApi` (`src/api/address.api.ts`)
| Method | Endpoint | Hành vi |
|---|---|---|
| `divisions()` | `GET /api/address` | 200, mảng tên tỉnh/thành (không trùng) |
| `wards(division)` | `GET /api/address/{tên tỉnh}` (đã `encodeURIComponent`) | 200, mảng phường/xã |

## Hành vi khác kỳ vọng
- `GET /api/address/<tên không tồn tại>` trả **200 `[]`**, không trả 4xx (kiểm 29-09-2026). Viết test negative thì assert mảng rỗng, không assert 404.

## TC hiện có
- `BOOK_ADDRESS_TC_001` Lấy danh sách tỉnh/thành phố (`@smoke`)
- `BOOK_ADDRESS_TC_002` Lấy danh sách phường/xã theo tỉnh/thành phố (`@regression`)
