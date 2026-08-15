import type BaseModel from './BaseModel';

export default interface Tag extends BaseModel {
  slug: string;
  name: Record<string, string>;
  forInfluencer: boolean;
}
