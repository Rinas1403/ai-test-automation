---
name: module-book-va-category
description: Module BOOK + danh mục sách (API) — endpoint, hành vi thật khác spec, cách tạo/dọn sách, bug 200≠201 của TC_005
type: project
updated: 11-10-2026
---

# Module BOOK & Category (API)

Prefix TC: `BOOK_BOOK_TC_nnn`. Danh sách: [[danh-muc-test-case]].

## `BookApi` (`src/api/book.api.ts`)
| Method | Endpoint | Hành vi thật (kiểm 29-09-2026) |
|---|---|---|
| `list(query)` | `GET /api/book?limit=&search=` | 200, body `{ list: [...] }`; mỗi sách có `id, name, status (AVAILABLE/UNAVAILABLE), price`. `limit=0` → 422 `Invalid data.` |
| `get(id)` | `GET /api/book/{id}` | Không tồn tại → 404 `Book not found.` |
| `create(payload)` | `POST /api/book` (cần token) | 🐞 trả **200** (Swagger khai 201), body chỉ `{ msg: 'Book created successfully.' }`, **không có id**. Không token → 401 |
| `update` | `PATCH /api/book/{id}` | Swagger khai 201 cho update (bất thường) — chưa có test |
| `remove(id)` | `DELETE /api/book/{id}` | 200; sau đó `get` → 404 |
| `findByName(name)` | tra `list({ search, limit: 10 })` | Dùng vì `create` không trả id |

Payload tạo sách: `{ name, status: 'AVAILABLE', categories: ['<tên danh mục>'], price: 75000 }`.

## `CategoryApi` (`src/api/category.api.ts`)
- `list()` `GET /api/category-book` · `create(name)` `POST /api/category-book` → **201** · `remove(name)` `DELETE /api/category-book/{name}` (xoá theo **tên**, không theo id).

## Luồng chuẩn `BOOK_BOOK_TC_005` (Tạo, xem và xoá sách của chính mình)
1. Arrange: `authedCategoryApi.create(uniqueName)` → 201, đăng ký `cleanup` xoá danh mục.
2. Act: `authedBookApi.create(payload)` → `expect.soft(status).toBe(201)` (FAIL do bug, có chủ đích) + `msg` đúng.
3. `findByName` lấy id → đăng ký `cleanup` xoá sách → `get` khớp `name/price/status` → `remove` 200 → `get` 404.

## Bug liên quan
- 200 ≠ 201 khi tạo sách — xem [[known-issues-he-thong]]. **Không** hạ assertion về 200.
