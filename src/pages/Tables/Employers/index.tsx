import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { FormattedMessage, useIntl } from 'umi';

//components
import { Button, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import TableSearch from '@/components/TableSearch';
import { CSVLink } from 'react-csv';

//api
import { getEmployers, changeActivationAPI } from './service';

// utils
import simpleSorter from '@/utils/simpleSorter';
import classNames from 'classnames';

//types
import type {
  TableListItem,
  Employer,
  VerificationSatusToggleForm,
} from './data';
import type { ProColumns } from '@ant-design/pro-table';
import { DownloadOutlined } from '@ant-design/icons';

const SCROLL_SETTINGS: { x?: number | string | true; y?: number | string } = {
  x: true,
};

const EmployersTable: React.FC = () => {
  // state / hooks
  const [tableData, setTabledata] = useState<TableListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [employerData, setEmployerData] = useState<Employer[]>([]);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Employer | null>(null);

  const verificationStatusModalFormRef = useRef(null);
  const intl = useIntl();

  // fetch data on first load
  useEffect(() => {
    fetchData();
  }, []);

  // methods
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getEmployers();

      setEmployerData(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setEmployerData, setLoading]);

  //Activate & Deactivating employers
  const changeActivationStatus = async ({
    reason,
  }: VerificationSatusToggleForm) => {
    try {
      const employer: Employer = selectedRow;
      const changeActivation = await changeActivationAPI({ employer, reason });

      message.success(`${changeActivation.data.message}`);

      // hide modal and reset form
      setVerificationModalVisible(false);
      verificationStatusModalFormRef.current.resetFields();

      // re-fetch employer with updated data
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  //if employer is deactivated then add class to grey out row
  const onRow = (record: TableListItem) => {
    const { cancelled, id } = record;
    const classes = classNames({
      deactivated: cancelled,
      selected: selectedRow?.id === id,
    });

    const onClick = () => setSelectedRow(record);

    return { className: classes, onClick };
  };

  const onSearch = (data: TableListItem[]) => {
    setTabledata(data);
  };

  const onVerificationStatusSelect = (record: Employer) => {
    setVerificationModalVisible(true);
    setSelectedRow(record);
  };

  const VerificationModal = useCallback(
    () => (
      <ModalForm
        formRef={verificationStatusModalFormRef}
        title={intl.formatMessage({
          id: 'pages.employer.verificationStatus.modal',
          defaultMessage: 'Reason for change',
        })}
        width="400px"
        visible={verificationModalVisible}
        onVisibleChange={setVerificationModalVisible}
        onFinish={changeActivationStatus}
      >
        <ProFormTextArea
          placeholder={intl.formatMessage({
            id: 'pages.employer.verificationStatus.modal.reason',
            defaultMessage: 'Specify reason',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.employer.verificationStatus.modal.reason.error"
                  defaultMessage="Reason is required"
                />
              ),
            },
          ]}
          width="md"
          name="reason"
        />
      </ModalForm>
    ),
    [verificationModalVisible, setVerificationModalVisible],
  );

  const IdRender = useCallback(
    (
      value:
        | boolean
        | React.ReactChild
        | React.ReactFragment
        | React.ReactPortal,
    ) => (
      <a
        href={`https://thankyoupayroll.co.nz/payroll/dashboard.php?ind=${value}`}
      >
        {value}
      </a>
    ),
    [],
  );

  const OptionsRender = useCallback(
    (_text: string, record: Employer): JSX.Element => {
      const status = record.cancelled ? 'Activate' : 'Deactivate';
      return (
        <TableDropdown
          key="actionGroup"
          onSelect={() => onVerificationStatusSelect(record)}
          menus={[{ key: `${status}`, name: `${status}` }]}
        />
      );
    },
    [],
  );

  // constants/computed values
  const columns: ProColumns<TableListItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({
          id: 'pages.employer.id',
          defaultMessage: 'CR',
        }),
        dataIndex: ['id'],
        sorter: simpleSorter('id'),
        render: IdRender,
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.verified',
          defaultMessage: 'Status',
        }),
        key: 'select',
        valueType: 'select',
        dataIndex: ['verificationStatus'],
        valueEnum: {
          'non-verified': { text: 'Non-verified', status: 'Default' },
          'pre-verified': { text: 'Pre-verified', status: 'Processing' },
          verified: { text: 'Verified', status: 'Success' },
          'un-verified': { text: 'Un-verified', status: 'Error' },
        },
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.registeredCompanyName',
          defaultMessage: 'Company',
        }),
        dataIndex: ['registeredCompanyName'],
        sorter: simpleSorter('registeredCompanyName'),
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.displayName',
          defaultMessage: 'Display Name',
        }),
        dataIndex: ['displayName'],
        sorter: simpleSorter('displayName'),
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.IRDnumber',
          defaultMessage: 'IRD Number',
        }),
        dataIndex: ['irdNumber'],
      },
      {
        title: (
          <FormattedMessage
            id="pages.employer.contactPerson"
            defaultMessage="Contact"
          />
        ),
        dataIndex: ['contactFirstName'],
        sorter: simpleSorter('contactFirstName'),
      },
      {
        valueType: 'option',
        title: intl.formatMessage({
          id: 'pages.general.options',
          defaultMessage: 'Options',
        }),
        render: OptionsRender,
      },
    ],
    [],
  );

  // constants/computed values
  const secondaryColumns: ProColumns<TableListItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({
          id: 'pages.employer.contactNunber',
          defaultMessage: 'Contact Number',
        }),
        copyable: true,
        dataIndex: 'contactPhone',
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.contactEmail',
          defaultMessage: 'Email',
        }),
        copyable: true,
        dataIndex: 'contactEmail',
      },
      {
        title: intl.formatMessage({
          id: 'pages.employer.lastPay',
          defaultMessage: 'Last Pay Type',
        }),
        dataIndex: 'lastPayType',
      },
    ],
    [],
  );

  const tableOptions = useMemo(() => ({ reload: fetchData }), [fetchData]);

  const expandedRowRender = (tableData) => {
    const data = [tableData];
    return (
      <ProTable
        columns={secondaryColumns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle={<FormattedMessage id="pages.employer.title" />}
        onRow={onRow}
        rowKey={(record: { id: string | number }) => record?.id}
        search={false}
        dataSource={tableData}
        columns={columns}
        loading={loading}
        scroll={SCROLL_SETTINGS}
        options={tableOptions}
        expandable={{ expandedRowRender }}
        toolBarRender={() => [
          <CSVLink
            data={tableData}
            key="employer-dataExport"
            filename={'employer_data.csv'}
          >
            <Button type="primary" icon={<DownloadOutlined />}>
              <FormattedMessage id="page.employer.csv" />
            </Button>
          </CSVLink>,
          <TableSearch
            key="employer-tableSearch"
            columns={columns.concat(secondaryColumns)}
            onSearch={onSearch}
            columnFilter
            dataSet={employerData}
          />,
        ]}
      />
      <VerificationModal />
    </PageContainer>
  );
};

export default EmployersTable;
