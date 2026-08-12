import type BaseModel from './BaseModel';

export type UserRole = 'admin' | 'user';

export default interface User extends BaseModel {
  name: string;
  role: UserRole;
  email?: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface AuthResponse {
  data: AuthPayload;
}
