import { BaseApi, type ApiResponse, type ErrorBody } from './base.api';

/** Address Management — danh sách tỉnh/thành và phường/xã (public, không cần token) */
export class AddressApi extends BaseApi {
  divisions(): Promise<ApiResponse<string[]>> {
    return this.send('GET', '/api/address');
  }

  wards(division: string): Promise<ApiResponse<string[] & Partial<ErrorBody>>> {
    return this.send('GET', `/api/address/${encodeURIComponent(division)}`);
  }
}
