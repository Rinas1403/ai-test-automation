import { expect, test } from '../../fixtures/api.fixture';
import { setTestMeta } from '../../utils/report';
import { TestData } from '../../utils/test-data';

test.describe('API Authentication', () => {
  test('Đăng ký tài khoản mới qua API thành công', { tag: ['@smoke', '@auth', '@api', '@account'] }, async ({ authApi }) => {
    await setTestMeta({
      testId: 'BOOK_AUTH_TC_007',
      feature: 'Đăng ký',
      severity: 'blocker',
      description: 'Kiểm tra POST /api/register với tên, email unique và mật khẩu hợp lệ trả về 201 kèm thông báo.',
    });

    const user = await test.step('Arrange: Sinh dữ liệu tài khoản unique', async () => TestData.newUser('apiRegister'));

    const response = await test.step('Act: Gọi POST /api/register', async () => authApi.register(user));

    await test.step('Assert: API trả 201 và có thông báo', async () => {
      expect(response.status, `Đăng ký phải trả 201, body: ${JSON.stringify(response.body)}`).toBe(201);
      expect(response.body.msg, 'Body phải có msg không rỗng').toBeTruthy();
    });
  });

  test('Đăng ký qua API bị từ chối khi email sai định dạng', { tag: ['@regression', '@auth', '@api'] }, async ({ authApi }) => {
    await setTestMeta({
      testId: 'BOOK_AUTH_TC_008',
      feature: 'Đăng ký',
      severity: 'normal',
      description: 'Kiểm tra POST /api/register với email không đúng định dạng trả về 422 và lỗi nằm ở field email.',
    });

    const user = await test.step('Arrange: Sinh dữ liệu với email sai định dạng', async () =>
      ({ ...TestData.newUser('apiRegisterInvalidEmail'), email: 'not-an-email' }));

    const response = await test.step('Act: Gọi POST /api/register', async () => authApi.register(user));

    await test.step('Assert: API trả 422, lỗi chỉ ra field email', async () => {
      expect(response.status, 'Email sai định dạng phải trả 422').toBe(422);
      expect(response.body.msg).toBe('Invalid data.');
      expect(response.body.fields?.email, 'Phải có thông báo lỗi cho field email').toContain("Property 'email' should be email");
    });
  });

  test('Đăng nhập qua API bị từ chối khi thiếu mật khẩu', { tag: ['@regression', '@auth', '@api'] }, async ({ authApi }) => {
    await setTestMeta({
      testId: 'BOOK_AUTH_TC_009',
      feature: 'Đăng nhập',
      severity: 'normal',
      description: 'Kiểm tra POST /api/login không có field password trả về 422 và lỗi nằm ở field password.',
    });

    const email = await test.step('Arrange: Sinh email unique, không kèm mật khẩu', async () => TestData.email('apiLoginNoPassword'));

    const response = await test.step('Act: Gọi POST /api/login chỉ với email', async () => authApi.login({ email }));

    await test.step('Assert: API trả 422, lỗi chỉ ra field password', async () => {
      expect(response.status, 'Thiếu password phải trả 422').toBe(422);
      expect(response.body.fields?.password, 'Phải có thông báo lỗi cho field password').toBeDefined();
    });
  });

  test('Lấy thông tin cá nhân bị từ chối khi không gửi token', { tag: ['@smoke', '@auth', '@api', '@security'] }, async ({ authApi }) => {
    await setTestMeta({
      testId: 'BOOK_AUTH_TC_010',
      feature: 'Thông tin cá nhân',
      severity: 'critical',
      description: 'Kiểm tra GET /api/me không có header Authorization trả về 401, không lộ thông tin người dùng.',
    });

    await test.step('Arrange: Dùng client ẩn danh, không có token', async () => {
      expect(authApi, 'Client ẩn danh phải được khởi tạo').toBeTruthy();
    });

    const response = await test.step('Act: Gọi GET /api/me', async () => authApi.me());

    await test.step('Assert: API trả 401 với thông báo thiếu token', async () => {
      expect(response.status, 'Không có token phải trả 401').toBe(401);
      expect(response.body.msg).toBe('Missing or invalid Authorization header');
    });
  });

  test('Đăng nhập qua API rồi lấy đúng thông tin cá nhân', { tag: ['@smoke', '@auth', '@api', '@account'] }, async ({ workerAccount, authedAuthApi }) => {
    await setTestMeta({
      testId: 'BOOK_AUTH_TC_011',
      feature: 'Thông tin cá nhân',
      severity: 'blocker',
      description: 'Kiểm tra token nhận được từ POST /api/login dùng được cho GET /api/me và trả đúng tên, email của tài khoản đã đăng ký.',
    });

    await test.step('Arrange: Có tài khoản đã đăng ký và đăng nhập lấy token', async () => {
      expect(workerAccount.token, 'Đăng nhập phải trả accessToken').toBeTruthy();
    });

    const response = await test.step('Act: Gọi GET /api/me bằng token', async () => authedAuthApi.me());

    await test.step('Assert: API trả 200 và đúng thông tin tài khoản', async () => {
      expect(response.status, `GET /api/me phải trả 200, body: ${JSON.stringify(response.body)}`).toBe(200);
      expect(response.body).toMatchObject({ name: workerAccount.name, email: workerAccount.email });
    });
  });
});
