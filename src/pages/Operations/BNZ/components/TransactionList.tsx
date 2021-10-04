import React from 'react';
import { List, Tag, Empty } from 'antd';
//packages
import moment from 'moment';
//types
import {
  TransactionDetails,
  HistoryPayload,
  History,
} from '@/services/BNZ/data';

const Tags = ({
  status,
  imported,
  total,
  error,
}: Partial<TransactionDetails>) => {
  if (status === 'pending') return <Tag color="processing">Pending</Tag>;

  const tagColor = error ? 'red' : 'green';
  return (
    <>
      <Tag color={tagColor}>{status}</Tag>
      <Tag color="purple">Transactions: {total}</Tag>
      <Tag color="magenta">Imported: {imported}</Tag>
    </>
  );
};

const ListItem = ({
  finishAt,
  details: { error, imported, total },
  status,
  createdAt,
}: Partial<History>) => (
  <List.Item>
    <List.Item.Meta
      title="Transaction Fetch"
      description={
        <>
          <span>Created at: {moment.unix(createdAt).format('MM/DD/YYYY')}</span>
          {finishAt && (
            <span>
              <br />
              Finished at: {moment.unix(finishAt).format('MM/DD/YYYY')}
            </span>
          )}
        </>
      }
    />
    <Tags status={status} imported={imported} total={total} error={error} />
  </List.Item>
);

const TransactionsList: React.FC<HistoryPayload> = ({
  data,
}: HistoryPayload) => {
  if (!data.length) return <Empty />;
  return (
    <List itemLayout="horizontal" dataSource={data} renderItem={ListItem} />
  );
};

export default React.memo(TransactionsList);
