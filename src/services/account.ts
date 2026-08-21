import xior from 'xior';

import type Account from '#types/Account';
import type { BaseResponse, PaginatedResponse } from '#types/Response';

export interface AccountFormData {
  platform: string;
  username: string;
}

// --- Standalone account APIs (admin) ---

export interface AccountListParams {
  page?: number;
  perPage?: number;
  platform?: string;
}

export async function getAccountsAdmin(
  params: AccountListParams = {},
): Promise<PaginatedResponse<Account>> {
  const res = await xior.get<PaginatedResponse<Account>>('/accounts', { params });
  return res.data;
}

export async function getAccount(id: number): Promise<Account> {
  const res = await xior.get<BaseResponse<Account>>(`/accounts/${id}`);
  return res.data.data;
}

export async function createAccountAdmin(data: AccountFormData): Promise<Account> {
  const res = await xior.post<BaseResponse<Account>>('/accounts', data);
  return res.data.data;
}

export async function updateAccountAdmin(
  id: number,
  data: Partial<AccountFormData>,
): Promise<Account> {
  const res = await xior.put<BaseResponse<Account>>(`/accounts/${id}`, data);
  return res.data.data;
}

export async function deleteAccountAdmin(id: number): Promise<void> {
  await xior.delete(`/accounts/${id}`);
}

// --- Influencer-scoped account APIs ---

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
