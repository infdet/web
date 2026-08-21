export default interface Account {
  id: number;
  platform: string;
  username: string;
  externalId: string | null;
  url: string | null;
}
