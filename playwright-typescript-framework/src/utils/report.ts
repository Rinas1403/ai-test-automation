import * as allure from 'allure-js-commons';

export type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export interface TestMeta {
  /** Mã manual test case — map sang RTM, format BOOK_<MODULE>_TC_nnn */
  testId: string;
  description: string;
  severity: Severity;
  /** Module nghiệp vụ — nhóm theo Feature trong Allure */
  feature: string;
}

/**
 * Khai báo metadata bắt buộc của reporting_rules.md cho 1 test.
 * Tags KHÔNG khai ở đây — allure-playwright tự đọc `tag` của Playwright
 * (`{ tag: ['@smoke'] }`), khai 2 nơi sẽ bị nhân đôi trong report.
 */
export async function setTestMeta(meta: TestMeta): Promise<void> {
  await allure.label('testId', meta.testId);
  await allure.description(meta.description);
  await allure.severity(meta.severity);
  await allure.feature(meta.feature);
}

const SENSITIVE_KEYS = ['password', 'password_confirmation', 'accesstoken', 'refetchtoken', 'authorization', 'token'];

/** Che giá trị bí mật trước khi đính vào report — report được chia sẻ, không được lộ mật khẩu/token */
export function maskSecrets<T>(value: T): T {
  if (Array.isArray(value)) return value.map(maskSecrets) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) =>
        [k, SENSITIVE_KEYS.includes(k.toLowerCase()) ? '***' : maskSecrets(v)]),
    ) as T;
  }
  return value;
}
