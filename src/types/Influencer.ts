import type Account from './Account';
import type BaseModel from './BaseModel';
import type Tag from './Tag';

export default interface Influencer extends BaseModel {
  slug: string;
  name: Record<string, string>;
  alias: string[];
  avatar: string | null;
  cover: string | null;
  gender: string | null;
  birthDate: string | null;
  age: number | null;
  region: string | null;
  height: number | null;
  weight: number | null;
  bust: number | null;
  waist: number | null;
  hip: number | null;
  accounts: Account[];
  tags: Tag[];
}
