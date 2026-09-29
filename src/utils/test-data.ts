import { randomBytes } from 'crypto';
import { env } from './env.config';

/**
 * Sinh data unique + traceable: nhìn vào DB biết ngay test nào tạo ra.
 * Format: auto_<testName>_<timestamp>_<random> — chạy song song không đụng nhau.
 */
export class TestData {
  private static suffix(): string {
    return `${Date.now()}_${randomBytes(2).toString('hex').toUpperCase()}`;
  }

  static email(testName: string): string {
    return `auto_${testName}_${this.suffix()}@auto.test`;
  }

  static username(testName: string): string {
    return `auto_${testName}_${this.suffix()}`;
  }

  static code(prefix: string): string {
    return `${prefix}_${this.suffix()}`;
  }

  static password(testName: string): string {
    return `Wrong_${testName}_${this.suffix()}`;
  }

  /**
   * Thay token trong file test-data/*.json bằng giá trị thật lúc chạy —
   * credentials lấy từ .env, giá trị random sinh mới cho từng test.
   */
  static resolve(value: string, testName: string): string {
    const tokens: Record<string, () => string> = {
      '{{ADMIN_EMAIL}}': () => env.username,
      '{{ADMIN_PASSWORD}}': () => env.password,
      '{{RANDOM_EMAIL}}': () => this.email(testName),
      '{{RANDOM_PASSWORD}}': () => this.password(testName),
    };
    return tokens[value]?.() ?? value;
  }
}
