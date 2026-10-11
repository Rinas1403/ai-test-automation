import type { BookPayload } from '../../api/book.api';
import { expect, test } from '../../fixtures/api.fixture';
import { setTestMeta } from '../../utils/report';
import { TestData } from '../../utils/test-data';

test.describe('API Book', () => {
  test('Lấy danh sách sách có phân trang theo limit', { tag: ['@smoke', '@book', '@api'] }, async ({ bookApi }) => {
    await setTestMeta({
      testId: 'BOOK_BOOK_TC_001',
      feature: 'Sách',
      severity: 'critical',
      description: 'Kiểm tra GET /api/book?limit=3 trả về 200, tối đa 3 sách, mỗi sách có đủ id, name, status, price.',
    });

    const limit = await test.step('Arrange: Chọn limit = 3', async () => 3);

    const response = await test.step(`Act: Gọi GET /api/book?limit=${limit}`, async () => bookApi.list({ limit }));

    await test.step('Assert: Danh sách không vượt limit và đủ field bắt buộc', async () => {
      expect(response.status).toBe(200);
      expect(response.body.list.length, `Số sách trả về không được vượt limit=${limit}`).toBeLessThanOrEqual(limit);
      for (const book of response.body.list) {
        expect(book, `Sách ${book.id} phải đủ field bắt buộc`).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          status: expect.stringMatching(/^(AVAILABLE|UNAVAILABLE)$/),
          price: expect.any(Number),
        });
      }
    });
  });

  test('Lấy danh sách sách bị từ chối khi limit nhỏ hơn 1', { tag: ['@regression', '@book', '@api'] }, async ({ bookApi }) => {
    await setTestMeta({
      testId: 'BOOK_BOOK_TC_002',
      feature: 'Sách',
      severity: 'minor',
      description: 'Kiểm tra GET /api/book?limit=0 vi phạm giá trị biên (minimum = 1) trả về 422.',
    });

    const limit = await test.step('Arrange: Chọn limit = 0 (dưới biên)', async () => 0);

    const response = await test.step(`Act: Gọi GET /api/book?limit=${limit}`, async () => bookApi.list({ limit }));

    await test.step('Assert: API trả 422 Invalid data', async () => {
      expect(response.status, 'limit=0 phải bị từ chối với 422').toBe(422);
      expect(response.body.msg).toBe('Invalid data.');
    });
  });

  test('Xem chi tiết sách không tồn tại trả về 404', { tag: ['@regression', '@book', '@api'] }, async ({ bookApi }) => {
    await setTestMeta({
      testId: 'BOOK_BOOK_TC_003',
      feature: 'Sách',
      severity: 'normal',
      description: 'Kiểm tra GET /api/book/{id} với id chắc chắn không tồn tại trả về 404 "Book not found."',
    });

    const id = await test.step('Arrange: Sinh id không tồn tại', async () => TestData.uniqueId('missingBook'));

    const response = await test.step('Act: Gọi GET /api/book/{id}', async () => bookApi.get(id));

    await test.step('Assert: API trả 404 Book not found', async () => {
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Book not found.');
    });
  });

  test('Tạo sách bị từ chối khi không gửi token', { tag: ['@smoke', '@book', '@api', '@security'] }, async ({ bookApi }) => {
    await setTestMeta({
      testId: 'BOOK_BOOK_TC_004',
      feature: 'Sách',
      severity: 'critical',
      description: 'Kiểm tra POST /api/book không có header Authorization trả về 401 và không tạo sách.',
    });

    const payload = await test.step('Arrange: Chuẩn bị payload sách hợp lệ', async (): Promise<BookPayload> => ({
      name: TestData.uniqueId('bookNoToken'),
      status: 'AVAILABLE',
      categories: [TestData.uniqueId('cat')],
      price: 50_000,
    }));

    const response = await test.step('Act: Gọi POST /api/book không có token', async () => bookApi.create(payload));

    await test.step('Assert: API trả 401 và sách không được tạo', async () => {
      expect(response.status).toBe(401);
      expect(response.body.msg).toBe('Missing or invalid Authorization header');
      expect(await bookApi.findByName(payload.name), 'Sách không được tồn tại sau request bị từ chối').toBeUndefined();
    });
  });

  test('Tạo, xem và xoá sách của chính mình', { tag: ['@smoke', '@book', '@api', '@account'] }, async ({ authedBookApi, authedCategoryApi, bookApi, cleanup }) => {
    await setTestMeta({
      testId: 'BOOK_BOOK_TC_005',
      feature: 'Sách',
      severity: 'blocker',
      description: 'Kiểm tra vòng đời sách: tạo danh mục + sách bằng tài khoản của test, xem chi tiết đúng dữ liệu, xoá xong thì GET trả 404.',
    });

    const payload = await test.step('Arrange: Tạo danh mục riêng cho test', async (): Promise<BookPayload> => {
      const category = TestData.uniqueId('bookCat');
      const created = await authedCategoryApi.create(category);
      expect(created.status, `Tạo danh mục phải trả 201, body: ${JSON.stringify(created.body)}`).toBe(201);
      cleanup(`xoá danh mục ${category}`, () => authedCategoryApi.remove(category));
      return { name: TestData.uniqueId('book'), status: 'AVAILABLE', categories: [category], price: 75_000 };
    });

    const bookId = await test.step('Act: Tạo sách rồi tra id theo tên', async () => {
      const created = await authedBookApi.create(payload);
      // Soft: lệch spec (Swagger 201 ↔ thực tế 200) vẫn đánh FAIL test, nhưng không chặn phần kiểm xem/xoá phía sau
      expect.soft(created.status, `Tạo sách phải trả 201 theo Swagger, body: ${JSON.stringify(created.body)}`).toBe(201);
      expect(created.body.msg, 'Tạo sách phải trả thông báo thành công').toBe('Book created successfully.');
      const book = await bookApi.findByName(payload.name);
      expect(book, `Phải tìm thấy sách "${payload.name}" vừa tạo`).toBeDefined();
      cleanup(`xoá sách ${payload.name}`, () => authedBookApi.remove(book!.id));
      return book!.id;
    });

    await test.step('Assert: Chi tiết sách đúng dữ liệu đã tạo', async () => {
      const detail = await bookApi.get(bookId);
      expect(detail.status).toBe(200);
      expect(detail.body).toMatchObject({ name: payload.name, price: payload.price, status: payload.status });
    });

    await test.step('Assert: Xoá sách thành công, xem lại trả 404', async () => {
      const removed = await authedBookApi.remove(bookId);
      expect(removed.status, `Xoá sách phải trả 200, body: ${JSON.stringify(removed.body)}`).toBe(200);
      expect((await bookApi.get(bookId)).status, 'Sách đã xoá phải trả 404').toBe(404);
    });
  });
});
