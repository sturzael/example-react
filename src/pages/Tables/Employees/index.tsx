import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'umi';

//components
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input } from 'antd';
import ProTable from '@ant-design/pro-table';

//api
import { getTimeline } from './service';

//typescript//types
import type { TableListItem } from './data';
import type { ProColumns } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';

const Others: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const intl = useIntl();

  const fetchTimeline = useCallback(
    async (id) => {
      try {
        //set loading state as true to make the table animate
        setLoading(true);

        //fetch our data
        const { data } = await getTimeline({ id: id });

        //we need to organise the data into a readable format to pass to the table - the current dataset wont work
        const splitData = splitHistory(data);
        console.log(splitData);

        //set the tableData state as our cleaned transformed data
        // setResult(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        //once we have got an error or the try has finished we can set loading as false
        setLoading(false);
      }
    },
    [setResult, setLoading],
  );

  const splitHistory = useCallback(({ timeline }) => {
    //create a new object
    const leaveData = {
      annualLeave: [],
      gross: [],
      holidayPay: [],
      workTime: [],
    };

    //loop through the current data set - for each key in the object
    for (const key in timeline) {
      const dataSet = timeline[key].dataPoints;

      //create a new array depending on our key
      const reduced = dataSet.reduce(
        (acc, timeline) => {
          acc[key].push(timeline.entries[0]);
          return acc;
        },
        { annualLeave: [], gross: [], holidayPay: [], workTime: [] },
      );

      //push our new array into our object
      leaveData[key] = reduced[key];
    }

    return leaveData;
  }, []);

  // our table columns - the dataindex needs to match our object key
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
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.employees.title',
      })}
      subTitle={intl.formatMessage({
        id: 'pages.employees.subTitle',
      })}
      onBack={() => window.history.back()}
    >
      <ProCard style={{ marginTop: 8, marginBottom: 24 }} gutter={8}>
        <ProCard colSpan={18}>
          <Input
            type={'text'}
            name={'search'}
            width={'20'}
            placeholder={'Employee ID'}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </ProCard>
        <ProCard colSpan={6}>
          <Button
            key="1"
            type="primary"
            onClick={() => fetchTimeline(searchTerm)}
          >
            Get Employee History
          </Button>
        </ProCard>
      </ProCard>

      <ProTable<TableListItem>
        rowKey={(record: { id: string | number }) => record?.id}
        search={false}
        dataSource={result}
        columns={columns}
        loading={loading}
      />
    </PageContainer>
  );
};

export default Others;
