import { expect, test } from '../../fixtures/api.fixture';
import { setTestMeta } from '../../utils/report';

test.describe('API Address', () => {
  test('Lấy danh sách tỉnh/thành phố', { tag: ['@smoke', '@address', '@api'] }, async ({ addressApi }) => {
    await setTestMeta({
      testId: 'BOOK_ADDRESS_TC_001',
      feature: 'Địa chỉ',
      severity: 'normal',
      description: 'Kiểm tra GET /api/address trả về 200, danh sách tên tỉnh/thành không rỗng, không trùng và có "Thành phố Hà Nội".',
    });

    await test.step('Arrange: Dùng client ẩn danh (endpoint public)', async () => {
      expect(addressApi, 'Client ẩn danh phải được khởi tạo').toBeTruthy();
    });

    const response = await test.step('Act: Gọi GET /api/address', async () => addressApi.divisions());

    await test.step('Assert: Danh sách hợp lệ, không trùng, có Hà Nội', async () => {
      expect(response.status).toBe(200);
      expect(response.body.length, 'Danh sách tỉnh/thành không được rỗng').toBeGreaterThan(0);
      expect(new Set(response.body).size, 'Tên tỉnh/thành không được trùng').toBe(response.body.length);
      expect(response.body).toContain('Thành phố Hà Nội');
    });
  });

  test('Lấy danh sách phường/xã theo tỉnh/thành phố', { tag: ['@regression', '@address', '@api'] }, async ({ addressApi }) => {
    await setTestMeta({
      testId: 'BOOK_ADDRESS_TC_002',
      feature: 'Địa chỉ',
      severity: 'normal',
      description: 'Kiểm tra GET /api/address/{divname} với một tỉnh/thành lấy từ danh sách thật trả về 200 và danh sách phường/xã không rỗng.',
    });

    const division = await test.step('Arrange: Lấy tỉnh/thành đầu tiên từ GET /api/address', async () => {
      const { body } = await addressApi.divisions();
      expect(body.length, 'Cần ít nhất 1 tỉnh/thành để test').toBeGreaterThan(0);
      return body[0];
    });

    const response = await test.step(`Act: Gọi GET /api/address/${division}`, async () => addressApi.wards(division));

    await test.step('Assert: Danh sách phường/xã không rỗng', async () => {
      expect(response.status).toBe(200);
      expect(response.body.length, `Tỉnh/thành "${division}" phải có phường/xã`).toBeGreaterThan(0);
    });
  });
});
