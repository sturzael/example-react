import { typAxios } from '@/utils/typAxios';
import type { TableListParams, Employer } from './data';

//TODO Error handling

export async function getEmployers(): Promise<{ data: any; status: number }> {
  const { data, status } = await typAxios({
    url: `/api/employers/`,
    method: 'GET',
  });
  return {
    data,
    status,
  };
}

export async function changeActivationAPI({
  employer,
  reason,
}: {
  employer: Employer;
  reason: string;
}): Promise<{ data: any; status: number }> {
  const endpoint: string = employer.cancelled ? 'activate' : 'deactivate';

  const { data, status } = await typAxios({
    url: `/api/employers/${employer.id}/${endpoint}`,
    method: 'POST',
    data: {
      notes: reason,
      labels: [`Verification status changed to ${endpoint}`],
    },
  });
  return {
    data,
    status,
  };
}
