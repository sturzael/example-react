import React, { useCallback, useEffect, useMemo, useState } from 'react';

//components
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input } from 'antd';
import ProTable from '@ant-design/pro-table';

//api
import { getTimeline } from './service';

//typescript//types
import type { TableListItem } from './data';
import type { ProColumns } from '@ant-design/pro-table';
import { DownloadOutlined } from '@ant-design/icons';

const Others: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  // fetch data on first load
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // methods
  const fetchTimeline = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const { data, status } = await getTimeline({ id: id });

        setResult(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setResult, setLoading],
  );

  // constants/computed values
  const columns: ProColumns<TableListItem>[] = useMemo(
    () => [
      {
        title: 'Date',
        dataIndex: ['Date'],
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <Input
        type={'text'}
        name={'search'}
        width={'20'}
        placeholder={'Employee ID'}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <Button
        type={'primary'}
        name={'timeline'}
        shape={'round'}
        onClick={() => fetchTimeline(searchTerm)}
      >
        Timeline
      </Button>
      <div>{result}</div>

      <ProTable<TableListItem>
        headerTitle={'Employee Table'}
        rowKey={(record: { id: string | number }) => record?.id}
        search={false}
        dataSource={result}
        columns={columns}
        // loading={loading}
      />
    </PageContainer>
  );
};

export default Others;
