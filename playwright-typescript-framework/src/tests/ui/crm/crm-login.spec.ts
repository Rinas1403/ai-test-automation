import loginData from '../../../../test-data/crm-login-invalid.json';
import { expect, test } from '../../../fixtures/ui.fixture';
import { CrmAdminLoginPage, type LoginOutcome } from '../../../pages/crm/crm-admin-login.page';
import { CrmClientLoginPage } from '../../../pages/crm/crm-client-login.page';
import { env } from '../../../utils/env.config';
import { setTestMeta } from '../../../utils/report';
import { TestData } from '../../../utils/test-data';

/** Dữ liệu cố định lấy nguyên văn từ docs/testcases/test_cases_login_web.md */
const WRONG_PASSWORD = 'SaiMatKhau_20260820';
const INVALID_CREDENTIALS = 'Invalid email or password';
const ADMIN_URL = `${env.crm.url}/admin/`;
const LOCK_WORDS = /locked|blocked|too many|try again in/i;
const DB_ERROR_TRACES = /sql syntax|mysql|database error|query error|a database error occurred/i;

const TAGS = ['@crm', '@login', '@ui'];

/**
 * Skip đặt ở describe (trước khi tạo trang), KHÔNG đặt trong thân test: test skip ngay sau khi mở trang trắng
 * làm Firefox headed chạy song song treo lúc đóng context tới hết timeout (tái hiện 11-10-2026).
 */
const SKIP_NO_ADMIN_PASSWORD = 'Thiếu ADMIN_PASSWORD trong .env — cần cho bước 4 (đăng nhập đúng sau chuỗi lần sai)';
const SKIP_NO_CUSTOMER = 'Thiếu CUSTOMER_EMAIL / CUSTOMER_PASSWORD trong .env';
const SKIP_NO_TC014 = 'Thiếu TC014_EMAIL / TC014_PASSWORD trong .env — cần tài khoản staff có mật khẩu chứa chữ cái (admin@example.com chỉ có số, RISK-LOGIN-07)';

test.describe('CRM — Đăng nhập khu quản trị · Nhóm C: Kiểm tra dữ liệu đầu vào & đăng nhập thất bại', () => {
  for (const data of loginData.requiredFields) {
    const skipOn: Record<string, string> = (data as { skipOn?: Record<string, string> }).skipOn ?? {};
    test.describe(() => {
      test.skip(({ browserName }) => browserName in skipOn, Object.values(skipOn).join(' '));
      test(`Kiểm tra trường bắt buộc trên biểu mẫu đăng nhập — biến thể ${data.variant}: ${data.case}`, {
        tag: [...(data.smoke ? ['@smoke'] : []), '@regression', ...TAGS],
      }, async ({ crmAdminLoginPage, page }) => {
        await setTestMeta({
          testId: 'CRM_LOGIN_TC_011',
          feature: 'Đăng nhập CRM',
          severity: 'blocker',
          description: `Biến thể ${data.variant} (${data.case}): bấm Login phải bị máy chủ từ chối, hiện đúng các dải báo lỗi trường bắt buộc theo thứ tự và vẫn ở trang đăng nhập.`,
        });

        await test.step('Arrange: Mở trang đăng nhập khu quản trị', async () => {
          await crmAdminLoginPage.open();
        });

        await test.step(`Act: Nhập Email/Password theo biến thể ${data.variant} rồi bấm Login`, async () => {
          await crmAdminLoginPage.login(data.email, data.password);
        });

        await test.step('Assert: Đúng các dải báo lỗi theo thứ tự, không vào được Dashboard', async () => {
          // So khớp cả danh sách → vừa đúng số lượng, thứ tự, vừa chứng minh không kèm "Invalid email or password"
          await expect(crmAdminLoginPage.errorAlerts, 'Số lượng, thứ tự và nội dung dải báo lỗi phải đúng như TC')
            .toHaveText(data.expectedErrors);
          await expect(page, 'Phải ở lại trang đăng nhập khu quản trị').toHaveURL(CrmAdminLoginPage.url);
        });
      });
    });
  }

  for (const data of loginData.invalidEmailFormats) {
    test(`Email sai định dạng bị trình duyệt chặn ngay, biểu mẫu không gửi đi — biến thể ${data.variant}: ${data.case}`, {
      tag: ['@regression', '@boundary', '@security', ...TAGS],
    }, async ({ crmAdminLoginPage, page }) => {
      await setTestMeta({
        testId: 'CRM_LOGIN_TC_012',
        feature: 'Đăng nhập CRM',
        severity: 'critical',
        description: `Biến thể ${data.variant} (${data.case}): trình duyệt phải bật cảnh báo ở ô Email, form không gửi request POST nào, trang không nạp lại và dữ liệu đã nhập còn nguyên.`,
      });

      let loginPosts = () => 0;
      await test.step('Arrange: Mở trang đăng nhập và bắt đầu theo dõi request gửi form', async () => {
        await crmAdminLoginPage.open();
        loginPosts = crmAdminLoginPage.trackLoginPosts();
      });

      const validity = await test.step(`Act: Nhập Email "${data.email}", Password "Abc12345" rồi bấm Login`, async () => {
        await crmAdminLoginPage.fillCredentials(data.email, 'Abc12345');
        await crmAdminLoginPage.submitExpectingBrowserBlock();
        const result = await crmAdminLoginPage.emailValidity();
        await crmAdminLoginPage.dismissValidationBubble();
        return result;
      });

      await test.step('Assert: Trình duyệt bật cảnh báo ở ô Email (chỉ chấm có/không, không chấm nội dung)', async () => {
        expect(validity.valid, 'Ô Email phải ở trạng thái không hợp lệ theo trình duyệt').toBe(false);
        expect(validity.message, 'Trình duyệt phải có thông báo cảnh báo cho ô Email').not.toBe('');
      });

      await test.step('Assert: Form không gửi đi — không request POST, không dải lỗi, dữ liệu còn nguyên', async () => {
        await expect(crmAdminLoginPage.emailInput, 'Ô Email phải giữ nguyên chữ đã nhập').toHaveValue(data.email);
        await expect(crmAdminLoginPage.passwordInput, 'Ô Password phải giữ nguyên chữ đã nhập').toHaveValue('Abc12345');
        await expect(crmAdminLoginPage.errorAlerts, 'Không được hiện dải báo lỗi của hệ thống').toHaveCount(0);
        await expect(page).toHaveURL(CrmAdminLoginPage.url);
        expect(loginPosts(), 'Không được có request POST /admin/authentication nào').toBe(0);
      });
    });
  }

  test('Sai thông tin đăng nhập trả về một thông báo chung, không tiết lộ email nào có thật', {
    tag: ['@smoke', '@regression', '@security', ...TAGS],
  }, async ({ crmAdminLoginPage }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_013',
      feature: 'Đăng nhập CRM',
      severity: 'blocker',
      description: 'Đăng nhập bằng email có thật + mật khẩu sai (a) và email không tồn tại (b) phải cho kết quả giống hệt nhau: 1 dải "Invalid email or password", vẫn ở trang đăng nhập.',
    });

    const variants = [
      { variant: 'a', case: 'email có thật, mật khẩu sai', email: env.crm.adminEmail, password: WRONG_PASSWORD },
      { variant: 'b', case: 'email không tồn tại', email: TestData.email('crmLoginTc013'), password: 'BatKyMatKhau@123' },
    ];
    const outcomes: LoginOutcome[] = [];

    for (const v of variants) {
      const outcome = await test.step(`Act: Biến thể ${v.variant} — đăng nhập với ${v.case}`, async () => {
        await crmAdminLoginPage.open();
        await crmAdminLoginPage.login(v.email, v.password);
        return crmAdminLoginPage.readOutcome();
      });

      await test.step(`Assert: Biến thể ${v.variant} — đúng 1 dải "${INVALID_CREDENTIALS}", vẫn ở trang đăng nhập`, async () => {
        expect(outcome.errors, `Biến thể ${v.variant} phải có đúng 1 dải báo lỗi chung`).toEqual([INVALID_CREDENTIALS]);
        expect(outcome.url, `Biến thể ${v.variant} phải ở lại trang đăng nhập`).toBe(CrmAdminLoginPage.url);
      });
      outcomes.push(outcome);
    }

    await test.step('Assert: Hai biến thể giống hệt nhau ở nội dung dải, số lượng dải và URL', async () => {
      expect(outcomes[0], 'Không được có dấu hiệu phân biệt email có thật với email không tồn tại').toEqual(outcomes[1]);
    });
  });

  test.describe(() => {
    test.skip(!env.crm.tc014Email || !env.crm.tc014Password, SKIP_NO_TC014);
    test('Mật khẩu đúng nhưng sai kiểu chữ hoa/thường thì bị từ chối', {
      tag: ['@regression', '@security', ...TAGS],
    }, async ({ crmAdminLoginPage, page }) => {
      await setTestMeta({
        testId: 'CRM_LOGIN_TC_014',
        feature: 'Đăng nhập CRM',
        severity: 'normal',
        description: 'Đăng nhập bằng tài khoản staff có mật khẩu chứa chữ cái nhưng đảo hoa/thường phải bị từ chối với 1 dải "Invalid email or password".',
      });

      await test.step('Arrange: Mở trang đăng nhập khu quản trị', async () => {
        await crmAdminLoginPage.open();
      });

      await test.step('Act: Đăng nhập bằng TC014_EMAIL và TC014_PASSWORD đã đảo hoa/thường', async () => {
        await crmAdminLoginPage.login(env.crm.tc014Email!, TestData.swapCase(env.crm.tc014Password!), { secretPassword: true });
      });

      await test.step('Assert: Bị từ chối với 1 dải báo lỗi chung, vẫn ở trang đăng nhập', async () => {
        await expect(crmAdminLoginPage.errorAlerts).toHaveText([INVALID_CREDENTIALS]);
        await expect(page).toHaveURL(CrmAdminLoginPage.url);
      });
    });
  });

  const lockVariants = [
    {
      variant: 'a', case: 'khoá theo email — 6 lần cùng admin@example.com',
      attempts: Array.from({ length: 6 }, () => ({ email: env.crm.adminEmail, password: WRONG_PASSWORD })),
    },
    {
      variant: 'b', case: 'khoá theo IP — 5 lần với 5 email không tồn tại khác nhau',
      attempts: ['a', 'b', 'c', 'd', 'e'].map((suffix) => ({ email: TestData.email(`crmLoginTc015${suffix}`), password: 'Sai@123' })),
    },
  ];

  for (const data of lockVariants) {
    test.describe(() => {
      test.skip(!env.crm.adminPassword, SKIP_NO_ADMIN_PASSWORD);
      test(`Đăng nhập sai nhiều lần liên tiếp không làm khoá tài khoản và không chặn theo IP — biến thể ${data.variant}: ${data.case}`, {
        tag: ['@regression', '@security', ...TAGS],
      }, async ({ crmAdminLoginPage, page }) => {
        await setTestMeta({
          testId: 'CRM_LOGIN_TC_015',
          feature: 'Đăng nhập CRM',
          severity: 'critical',
          description: `Biến thể ${data.variant}: gửi sai ${data.attempts.length} lần liên tiếp, mọi lần đều chỉ báo "Invalid email or password", không có thông báo khoá, không HTTP 429; ngay sau đó admin vẫn đăng nhập thành công.`,
        });

        await test.step('Arrange: Mở trang đăng nhập khu quản trị', async () => {
          await crmAdminLoginPage.open();
        });

        for (const [index, attempt] of data.attempts.entries()) {
          await test.step(`Act + Assert: Lần sai thứ ${index + 1}/${data.attempts.length} chỉ báo lỗi chung, không HTTP 429`, async () => {
            const response = await crmAdminLoginPage.login(attempt.email, attempt.password);
            expect(response.status(), `Lần ${index + 1} không được bị chặn tần suất (429)`).not.toBe(429);
            await expect(crmAdminLoginPage.errorAlerts, `Lần ${index + 1} phải chỉ có 1 dải lỗi chung, không đếm ngược`)
              .toHaveText([INVALID_CREDENTIALS]);
          });
        }

        await test.step('Assert: Trang không có thông báo khoá / hạn chế nào', async () => {
          await expect(page.locator('body'), 'Không được có từ locked / blocked / too many / try again in')
            .not.toHaveText(LOCK_WORDS);
        });

        await test.step('Act: Đăng nhập ngay bằng admin@example.com + ADMIN_PASSWORD', async () => {
          await crmAdminLoginPage.login(env.crm.adminEmail, env.crm.adminPassword!, { secretPassword: true });
        });

        await test.step('Assert: Đăng nhập thành công, dừng ở /admin/', async () => {
          await expect(page, 'Tài khoản admin không được bị khoá sau chuỗi lần sai').toHaveURL(ADMIN_URL);
        });
      });
    });
  }

  test('Sau khi đăng nhập thất bại, ô Email phải còn giữ email vừa nhập', {
    tag: ['@regression', '@knownbug', ...TAGS],
  }, async ({ crmAdminLoginPage }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_016',
      feature: 'Đăng nhập CRM',
      severity: 'critical',
      description: 'Sau khi đăng nhập lỗi, ô Email phải còn admin@example.com. Bug đã biết (AMB-LOGIN-10, PO xác nhận): ô trở về rỗng — FAIL là kết quả đúng, không sửa assertion. Context Playwright luôn sạch, không tự điền → tương đương cửa sổ ẩn danh tắt tự điền.',
    });

    await test.step('Arrange: Mở trang đăng nhập trong context sạch (không lưu mật khẩu, không tự điền)', async () => {
      await crmAdminLoginPage.open();
    });

    const response = await test.step('Act: Đăng nhập admin@example.com với mật khẩu sai', async () =>
      crmAdminLoginPage.login(env.crm.adminEmail, WRONG_PASSWORD));

    await test.step(`Assert: Hiện dải "${INVALID_CREDENTIALS}"`, async () => {
      await expect(crmAdminLoginPage.errorAlerts).toHaveText([INVALID_CREDENTIALS]);
    });

    await test.step('Assert: Ô Email còn giữ admin@example.com (HTML máy chủ trả về mang value)', async () => {
      const serverHtml = await response.text();
      expect.soft(serverHtml, 'HTML máy chủ trả về phải có input#email mang value="admin@example.com"')
        .toMatch(/<input[^>]*id="email"[^>]*value="admin@example\.com"/);
      await expect(crmAdminLoginPage.emailInput, 'Người dùng không phải gõ lại email').toHaveValue(env.crm.adminEmail);
    });
  });

  for (const data of loginData.attackPasswords) {
    test(`Chuỗi tấn công nhập vào ô Password không vượt qua được xác thực và không được thực thi — biến thể ${data.variant}: ${data.case}`, {
      tag: ['@regression', '@security', ...TAGS],
    }, async ({ crmAdminLoginPage, page }) => {
      await setTestMeta({
        testId: 'CRM_LOGIN_TC_017',
        feature: 'Đăng nhập CRM',
        severity: 'blocker',
        description: `Biến thể ${data.variant} (${data.case}): không vào được Dashboard, không hộp thoại nào bật lên, chỉ báo "Invalid email or password", máy chủ trả 200 (không 500), chuỗi tấn công không xuất hiện dạng thẻ sống trong HTML.`,
      });

      const dialogs: string[] = [];
      await test.step('Arrange: Mở trang đăng nhập và theo dõi hộp thoại bật lên', async () => {
        page.on('dialog', async (dialog) => {
          dialogs.push(dialog.message());
          await dialog.dismiss();
        });
        await crmAdminLoginPage.open();
      });

      const email = data.existingEmail ? env.crm.adminEmail : TestData.email('crmLoginTc017');
      const response = await test.step(`Act: Đăng nhập với Password là chuỗi ${data.case}`, async () =>
        crmAdminLoginPage.login(email, data.password));

      await test.step('Assert: Máy chủ trả 200, không có hộp thoại, chỉ báo lỗi chung, vẫn ở trang đăng nhập', async () => {
        expect(response.status(), 'Máy chủ phải trả 200, không lỗi 500').toBe(200);
        expect(dialogs, 'Không được có hộp thoại nào bật lên').toEqual([]);
        await expect(crmAdminLoginPage.errorAlerts).toHaveText([INVALID_CREDENTIALS]);
        await expect(page).toHaveURL(CrmAdminLoginPage.url);
      });

      await test.step('Assert: Không có dấu vết lỗi cơ sở dữ liệu, chuỗi tấn công không xuất hiện dạng sống', async () => {
        await expect(page.locator('body'), 'Không được hiện thông báo lỗi cơ sở dữ liệu').not.toHaveText(DB_ERROR_TRACES);
        expect(await response.text(), 'Chuỗi tấn công không được nằm nguyên dạng trong HTML trả về').not.toContain(data.password);
      });
    });
  }

  test('Mật khẩu chứa ký tự đa ngôn ngữ và emoji không làm hệ thống lỗi máy chủ', {
    tag: ['@regression', '@boundary', '@localization', ...TAGS],
  }, async ({ crmAdminLoginPage, page }) => {
    await setTestMeta({
      testId: 'CRM_LOGIN_TC_018',
      feature: 'Đăng nhập CRM',
      severity: 'normal',
      description: 'Mật khẩu "MậtKhẩuTiếngViệt😀🎉" với email không tồn tại: máy chủ trả 200, trang đăng nhập nạp lại bình thường, đúng 1 dải "Invalid email or password" không vỡ ký tự.',
    });

    await test.step('Arrange: Mở trang đăng nhập khu quản trị', async () => {
      await crmAdminLoginPage.open();
    });

    const response = await test.step('Act: Đăng nhập email không tồn tại với mật khẩu tiếng Việt + emoji', async () =>
      crmAdminLoginPage.login(TestData.email('crmLoginTc018'), 'MậtKhẩuTiếngViệt😀🎉'));

    await test.step('Assert: Máy chủ trả 200, trang đăng nhập hiển thị bình thường', async () => {
      expect(response.status(), 'Máy chủ phải trả 200, không lỗi 500').toBe(200);
      await expect(page).toHaveTitle(CrmAdminLoginPage.title);
      await expect(crmAdminLoginPage.heading).toBeVisible();
    });

    await test.step('Assert: Đúng 1 dải báo lỗi tiếng Anh, không vỡ ký tự', async () => {
      await expect(crmAdminLoginPage.errorAlerts, 'Nội dung phải đúng nguyên văn — không dấu hỏi / ô vuông lạ')
        .toHaveText([INVALID_CREDENTIALS]);
    });
  });

  test.describe(() => {
    test.skip(!env.crm.customerEmail || !env.crm.customerPassword, SKIP_NO_CUSTOMER);
    test('Tài khoản khách hàng hợp lệ bị từ chối ở khu quản trị mà không lộ ra rằng email đó có tài khoản', {
      tag: ['@regression', '@security', '@permission', ...TAGS],
    }, async ({ crmAdminLoginPage, crmClientLoginPage, page }) => {
      await setTestMeta({
        testId: 'CRM_LOGIN_TC_019',
        feature: 'Đăng nhập CRM',
        severity: 'critical',
        description: 'Cặp Customer hợp lệ bị khu quản trị từ chối giống hệt email không tồn tại (REQ-15), trong khi cùng cặp đó đăng nhập được ở cổng khách hàng — chứng minh bị chặn do ranh giới hệ thống, không phải sai mật khẩu.',
      });

      const customerOutcome = await test.step('Act 1: Đăng nhập khu quản trị bằng cặp Customer', async () => {
        await crmAdminLoginPage.open();
        await crmAdminLoginPage.login(env.crm.customerEmail!, env.crm.customerPassword!, { secretPassword: true });
        return crmAdminLoginPage.readOutcome();
      });

      await test.step('Assert 1: Bị từ chối với 1 dải lỗi chung, không có phiên khu quản trị', async () => {
        expect(customerOutcome.errors).toEqual([INVALID_CREDENTIALS]);
        expect(customerOutcome.url).toBe(CrmAdminLoginPage.url);
        await page.goto(ADMIN_URL);
        await expect(page, 'Mở /admin/ phải bị đẩy về trang đăng nhập — không phiên quản trị nào được tạo')
          .toHaveURL(CrmAdminLoginPage.url);
      });

      await test.step('Act 2 + Assert 2: Cùng cặp đó đăng nhập thành công ở cổng khách hàng', async () => {
        await crmClientLoginPage.open();
        await crmClientLoginPage.login(env.crm.customerEmail!, env.crm.customerPassword!);
        await expect(page).toHaveURL(CrmClientLoginPage.homeUrl);
        await expect(page).toHaveTitle(CrmClientLoginPage.homeTitle);
      });

      const controlOutcome = await test.step('Act 3: Quay lại khu quản trị, đăng nhập bằng email không tồn tại', async () => {
        await crmAdminLoginPage.open();
        await crmAdminLoginPage.login(TestData.email('crmLoginTc019'), 'BatKyMatKhau@123');
        return crmAdminLoginPage.readOutcome();
      });

      await test.step('Assert 3 + 4: Kết quả đối chứng giống hệt kết quả của cặp Customer', async () => {
        expect(controlOutcome.errors).toEqual([INVALID_CREDENTIALS]);
        expect(controlOutcome.url).toBe(CrmAdminLoginPage.url);
        expect(customerOutcome, 'Không được lộ ra email Customer có tài khoản').toEqual(controlOutcome);
      });
    });
  });

  test.describe(() => {
    test.skip(!env.crm.customerEmail || !env.crm.customerPassword, SKIP_NO_CUSTOMER);
    test('Đang có phiên cổng khách hàng hợp lệ vẫn không mở được URL nội bộ khu quản trị', {
      tag: ['@regression', '@security', '@permission', ...TAGS],
    }, async ({ crmAdminLoginPage, crmClientLoginPage, page }) => {
      await setTestMeta({
        testId: 'CRM_LOGIN_TC_020',
        feature: 'Đăng nhập CRM',
        severity: 'critical',
        description: 'Với khu /admin, Customer đã đăng nhập cổng khách hàng phải hành xử y hệt khách chưa đăng nhập: mở /admin/clients bị đẩy về /admin/authentication, không thấy dữ liệu nghiệp vụ.',
      });

      await test.step('Arrange: Đăng nhập cổng khách hàng bằng cặp Customer', async () => {
        await crmClientLoginPage.open();
        await crmClientLoginPage.login(env.crm.customerEmail!, env.crm.customerPassword!);
      });

      await test.step('Act + Assert 1: Mở trang chủ cổng khách hàng — phiên đang hoạt động', async () => {
        await crmClientLoginPage.openHome();
        await expect(page, 'Phiên khách hàng phải còn — không bị đẩy về trang đăng nhập').toHaveURL(CrmClientLoginPage.homeUrl);
        await expect(page).toHaveTitle(CrmClientLoginPage.homeTitle);
      });

      await test.step('Act: Gõ thẳng /admin/clients', async () => {
        await page.goto(`${env.crm.url}/admin/clients`);
      });

      await test.step('Assert: Bị đẩy về trang đăng nhập khu quản trị, không thấy dữ liệu khách hàng', async () => {
        await expect(page).toHaveURL(CrmAdminLoginPage.url);
        await expect(crmAdminLoginPage.heading, 'Phải hiển thị biểu mẫu đăng nhập khu quản trị').toBeVisible();
        await expect(crmAdminLoginPage.emailInput).toBeVisible();
        await expect(page.getByRole('table'), 'Không được thấy bảng danh sách khách hàng').toHaveCount(0);
      });
    });
  });
});
