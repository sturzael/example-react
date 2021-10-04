import { typAxios } from '@/utils/typAxios';

export async function getTimeline({
  id,
}: {
  id: string;
}): Promise<{ data: any; status: number }> {
  const { data, status } = await typAxios({
    url: `/api/timelines/employees/${id}`,
    method: 'GET',
  });
  return {
    data,
    status,
  };
}
