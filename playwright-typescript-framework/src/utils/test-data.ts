import { randomBytes } from 'node:crypto';

export interface NewUser {
  name: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Sinh data unique + traceable theo format `auto_<testName>_<YYYYMMDDHHmmss>_<rand>`:
 * nhìn vào dữ liệu trên hệ thống là biết test nào, chạy lúc nào tạo ra — an toàn khi chạy song song.
 */
export class TestData {
  private static stamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  private static rand(length = 4): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  private static slug(testName: string): string {
    return testName.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  }

  static uniqueId(testName: string): string {
    return `auto_${this.slug(testName)}_${this.stamp()}_${this.rand()}`;
  }

  static email(testName: string): string {
    return `${this.uniqueId(testName)}@auto.test`;
  }

  /** Mật khẩu ngẫu nhiên chỉ sống trong bộ nhớ của lần chạy — không ghi ra file nào */
  static password(): string {
    return `Auto@${this.rand(8)}A1`;
  }

  static phone(): string {
    return `09${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
  }

  static newUser(testName: string): NewUser {
    return {
      name: `Auto ${this.uniqueId(testName)}`,
      email: this.email(testName),
      password: this.password(),
      phone: this.phone(),
    };
  }
}
