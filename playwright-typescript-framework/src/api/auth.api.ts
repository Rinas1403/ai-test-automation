import { BaseApi, type ApiResponse, type ErrorBody, type MessageBody } from './base.api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginBody {
  msg: string;
  accessToken: string;
  exp: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  phone: string;
  address: string;
}

/** Authentication Management — /api/register · /api/login · /api/me · /api/logout */
export class AuthApi extends BaseApi {
  register(payload: RegisterPayload): Promise<ApiResponse<MessageBody & Partial<ErrorBody>>> {
    return this.send('POST', '/api/register', { data: payload });
  }

  /** Nhận Partial để test được case thiếu field */
  login(payload: Partial<LoginPayload>): Promise<ApiResponse<LoginBody & Partial<ErrorBody>>> {
    return this.send('POST', '/api/login', { data: payload });
  }

  me(): Promise<ApiResponse<Profile & Partial<ErrorBody>>> {
    return this.send('GET', '/api/me');
  }

  logout(): Promise<ApiResponse<MessageBody>> {
    return this.send('DELETE', '/api/logout');
  }
}
