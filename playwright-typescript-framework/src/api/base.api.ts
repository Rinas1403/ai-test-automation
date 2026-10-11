import { test, type APIRequestContext } from '@playwright/test';
import { logger } from '../utils/logger';
import { maskSecrets } from '../utils/report';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T> {
  status: number;
  body: T;
}

/** Body lỗi chung của API AnhTester Book — 422 có thêm `fields` */
export interface ErrorBody {
  msg: string;
  fields?: Record<string, string[]>;
}

export interface MessageBody {
  msg: string;
}

interface RequestOptions {
  data?: unknown;
  params?: Record<string, string | number | boolean>;
}

/**
 * Lớp cha của mọi API client.
 * - Mỗi request là 1 step `API: <METHOD> <path>` trong Allure, kèm attachment request/response đã che bí mật
 * - Token Bearer truyền qua constructor — client ẩn danh thì bỏ trống
 */
export abstract class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  protected async send<T>(method: HttpMethod, url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return test.step(`API: ${method} ${url}`, async () => {
      const headers: Record<string, string> = this.token ? { Authorization: `Bearer ${this.token}` } : {};
      logger.info(`${method} ${url}`);

      const response = await this.request.fetch(url, {
        method,
        headers,
        data: options.data,
        params: options.params,
      });

      const text = await response.text();
      const body = (text ? safeJson(text) : null) as T;
      logger.info(`${method} ${url} → ${response.status()}`);

      await test.info().attach(`${method} ${url} — request/response`, {
        contentType: 'application/json',
        body: JSON.stringify(
          {
            request: { method, url, params: options.params, headers: maskSecrets(headers), body: maskSecrets(options.data) },
            response: { status: response.status(), body: maskSecrets(body) },
          },
          null,
          2,
        ),
      });

      return { status: response.status(), body };
    });
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
