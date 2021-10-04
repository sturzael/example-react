import { typAxios } from '@/utils/typAxios';

import { AxiosPromise, AxiosResponse } from 'axios';
import {
  BNZAccount,
  BNZConnectUrl,
  BNZSettings,
  HistoryPayload,
  TransactionPayload,
} from './data';

export function tokenRefresh(): AxiosPromise {
  return typAxios({
    url: '/api/integrations/bnz/token/',
    method: 'POST',
    data: {},
    suppressErrorCodes: [404],
  });
}

export function getSettings(): AxiosPromise<BNZSettings> {
  return typAxios({
    url: '/api/integrations/bnz/',
    method: 'GET',
    /* suppress 404 error message since that's the way to know
      settings haven't been set */
    suppressErrorCodes: [404],
  });
}

export function postSettings(settings: BNZSettings): AxiosPromise<BNZSettings> {
  return typAxios({
    url: '/api/integrations/bnz/',
    method: 'POST',
    data: {
      ...settings,
      name: 'BNZ integration (system)',
    },
  });
}

export function deleteSettings(): AxiosPromise {
  return typAxios({
    url: '/api/integrations/bnz/',
    method: 'DELETE',
  });
}

export function bnzConnect(): AxiosPromise<BNZConnectUrl> {
  return typAxios({
    url: '/api/integrations/bnz/connect/',
    method: 'GET',
  });
}

export async function getAccounts(): Promise<AxiosResponse<BNZAccount[]>> {
  await tokenRefresh();
  return typAxios({
    url: '/api/integrations/bnz/accounts',
    method: 'GET',
  });
}

export async function getHistory(): Promise<AxiosResponse<HistoryPayload>> {
  await tokenRefresh();
  return typAxios({
    url: '/api/integrations/bnz/histories',
    method: 'GET',
    params: {
      count: '100',
    },
  });
}

export async function getTransactions(): Promise<
  AxiosResponse<TransactionPayload>
> {
  await tokenRefresh();
  return typAxios({
    url: '/api/integrations/bnz/transactions/',
    method: 'POST',
    params: {
      from: '',
      to: '',
    },
  });
}
