import type Account from './Account';
import type BaseModel from './BaseModel';
import type Tag from './Tag';

export default interface Influencer extends BaseModel {
  slug: string;
  name: Record<string, string>;
  avatar: string | null;
  cover: string | null;
  accounts: Account[];
  tags: Tag[];
}
