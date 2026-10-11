import { BaseApi, type ApiResponse, type ErrorBody, type MessageBody } from './base.api';

export interface CategoryList {
  list: { name: string; bookCount: number }[];
  pagination: { total: number };
}

/** Category Management — /api/category-book */
export class CategoryApi extends BaseApi {
  list(): Promise<ApiResponse<CategoryList>> {
    return this.send('GET', '/api/category-book');
  }

  create(name: string): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('POST', '/api/category-book', { data: { name } });
  }

  remove(name: string): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('DELETE', `/api/category-book/${encodeURIComponent(name)}`);
  }
}
