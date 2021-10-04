import request from '@/utils/request';
import typAxios from '@/utils/typAxios';
import parseJwt from '@/utils/parseJwt';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return Promise.resolve(
    parseJwt(typAxios.defaults.headers.common['Authorization']),
  );
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
