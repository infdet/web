import type BaseModel from './BaseModel';
import type User from './User';

export default interface Comment extends BaseModel {
  body: string;
  userId: number;
  user?: User | null;
}
