import React, { useEffect, useCallback, useReducer } from 'react';
import { Button, Tag, Modal } from 'antd';
import { useIntl } from 'umi';
//components
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import TransactionList from './components/TransactionList';
import TransactionDescription from './components/TransactionDescription';
//api
import { getHistory, getTransactions } from '@/services/BNZ/service';
//types
import { History } from '@/services/BNZ/data';
//packages
import moment from 'moment';
//types
interface TransactionStates {
  isLoading: boolean;
  isImporting: boolean;
  todaysTransactions: Array<History>;
  allTimeTransactions: Array<History>;
  pullingTimer: NodeJS.Timeout;
}

const Transactions: React.FC = () => {
  //lang
  const intl = useIntl();

  //reducer hook & states
  const initialState: TransactionStates = {
    isLoading: true,
    isImporting: false,
    todaysTransactions: [],
    allTimeTransactions: [],
    pullingTimer: null,
  };

  const TransactionReducer = (state, action) => {
    switch (action.type) {
      case 'render': {
        return { ...state, isLoading: false };
      }
      case 'loading': {
        return { ...state, isLoading: true };
      }
      case 'history': {
        return {
          ...state,
          todaysTransactions: action.payload.today,
          allTimeTransactions: action.payload.rest,
        };
      }
      case 'import': {
        if (state.pullingTimer) clearInterval(state.pullingTimer);
        return {
          ...state,
          pullingTimer: action.payload.timer,
          isImporting: action.payload.importing,
        };
      }
      default:
        break;
    }
  };

  const [state, dispatch] = useReducer(TransactionReducer, initialState);

  const {
    isLoading,
    todaysTransactions,
    allTimeTransactions,
    isImporting,
  }: TransactionStates = state;

  useEffect(() => {
    //fetch transaction history on load
    fetchHistory();
  }, []);

  const start = async () => {
    dispatch({ type: 'import', payload: { importing: true, timer: null } });
    try {
      //fetch new transactions from BNZ
      const { data } = await getTransactions();
      if (data.status != 'success') return;
      //refetch history to update UI
      fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async () => {
    try {
      //fetch history & pass data into splitHistory function
      const data = await getHistory();
      const splitData = splitHistory(data);

      dispatch({
        type: 'import',
        payload: {
          importing: splitData.hasPending,
          timer: splitData.hasPending && setInterval(fetchHistory, 3500),
        },
      });

      dispatch({ type: 'history', payload: splitData });
    } catch (error) {
      //if there is no history in the API, this indicates that the intergration isn't set up
      console.error(error);
      if (error.response.status === 404) warningModal();
    } finally {
      dispatch({ type: 'render' });
    }
  };

  const splitHistory = useCallback(
    ({ data }) =>
      data.reduce(
        (acc, transaction) => {
          const { createdAt, status } = transaction;

          // If there is a pending fetch in progress then set dispatch action
          if (status === 'pending') {
            acc.hasPending = true;
          }

          //convert todays date into timestamp
          const today = moment(new Date()).format('MM/DD/YYYY');
          const transactionDate = moment.unix(createdAt).format('MM/DD/YYYY');

          if (today === transactionDate) {
            acc.today.push(transaction);
          } else {
            acc.rest.push(transaction);
          }

          return acc;
        },
        { today: [], rest: [], hasPending: false },
      ),
    [],
  );

  const warningModal = useCallback(() => {
    Modal.warning({
      title: 'Error',
      content: 'Please enter your BNZ integration settings before continuing.',
      onOk: redirect,
    });
  }, []);

  const redirect = useCallback(() => {
    window.location.href = '/payroll/admin-dashboard/Settings/integrations/BNZ';
  }, []);

  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.operations.bnz.title',
      })}
      subTitle={intl.formatMessage({
        id: 'pages.operations.bnz.subTitle',
      })}
      tags={
        isImporting ? (
          <Tag color="green">Running</Tag>
        ) : (
          <Tag color="blue">Ready</Tag>
        )
      }
      extra={
        isImporting ? (
          <>
            <Button type="default" onClick={fetchHistory}>
              Refresh
            </Button>
            <Button key="1" disabled type="primary">
              Running
            </Button>
          </>
        ) : (
          <Button key="1" type="primary" onClick={start}>
            Start
          </Button>
        )
      }
      onBack={() => window.history.back()}
    >
      {/* Description */}
      <ProCard style={{ marginTop: 8 }} gutter={24} ghost>
        <ProCard colSpan={24}>
          <TransactionDescription />
        </ProCard>
      </ProCard>

      {/* History Cards */}
      <ProCard style={{ marginTop: 24 }} gutter={24} ghost>
        <ProCard title="Today" headerBordered colSpan={12} loading={isLoading}>
          <TransactionList data={todaysTransactions} />
        </ProCard>

        <ProCard
          title="All Time"
          headerBordered
          colSpan={12}
          loading={isLoading}
        >
          <TransactionList data={allTimeTransactions} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Transactions;
