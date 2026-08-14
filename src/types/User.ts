import type BaseModel from './BaseModel';

export type UserRole = 'admin' | 'editor' | 'user';

export default interface User extends BaseModel {
  name: string;
  role: UserRole;
  email?: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}
