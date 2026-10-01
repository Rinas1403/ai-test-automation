import { BaseApi, type ApiResponse, type ErrorBody, type MessageBody } from './base.api';

export type BookStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface BookPayload {
  name: string;
  status: BookStatus;
  categories: string[];
  price: number;
  slug?: string;
  description?: string;
  pictures?: string[];
  promotions?: string[];
}

export interface Book {
  id: string;
  name: string;
  description: string;
  slug: string;
  categories: string[];
  status: BookStatus;
  price: number;
  currentPrice: number;
  viewCount: number;
}

export interface BookListQuery {
  limit?: number;
  page?: number;
  search?: string;
  sort?: 'name' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'slug' | 'price' | 'currentPrice' | 'viewCount';
  sortBy?: 'asc' | 'desc';
}

export interface BookList {
  list: Book[];
}

/** Book Management — /api/book */
export class BookApi extends BaseApi {
  list(query: BookListQuery = {}): Promise<ApiResponse<BookList & Partial<ErrorBody>>> {
    return this.send('GET', '/api/book', { params: { ...query } });
  }

  get(id: string): Promise<ApiResponse<Book & Partial<ErrorBody>>> {
    return this.send('GET', `/api/book/${encodeURIComponent(id)}`);
  }

  create(payload: BookPayload): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('POST', '/api/book', { data: payload });
  }

  update(id: string, payload: Partial<BookPayload>): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('PATCH', `/api/book/${encodeURIComponent(id)}`, { data: payload });
  }

  remove(id: string): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('DELETE', `/api/book/${encodeURIComponent(id)}`);
  }

  /** POST /api/book chỉ trả `msg`, không trả id → tra lại theo tên (tên unique nhờ TestData) */
  async findByName(name: string): Promise<Book | undefined> {
    const { body } = await this.list({ search: name, limit: 10 });
    return body.list.find((book) => book.name === name);
  }
}
