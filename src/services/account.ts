import xior from 'xior';

import type Account from '#types/Account';
import type { BaseResponse } from '#types/Response';

export interface AccountFormData {
  platform: string;
  username: string;
}

export async function getAccounts(influencerId: number): Promise<Account[]> {
  const res = await xior.get<BaseResponse<Account[]>>(`/influencers/${influencerId}/accounts`);
  return res.data.data;
}

export async function createAccount(influencerId: number, data: AccountFormData): Promise<Account> {
  const res = await xior.post<BaseResponse<Account>>(`/influencers/${influencerId}/accounts`, data);
  return res.data.data;
}

export async function updateAccount(
  influencerId: number,
  id: number,
  data: Partial<AccountFormData>,
): Promise<Account> {
  const res = await xior.put<BaseResponse<Account>>(
    `/influencers/${influencerId}/accounts/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteAccount(influencerId: number, id: number): Promise<void> {
  await xior.delete(`/influencers/${influencerId}/accounts/${id}`);
}
