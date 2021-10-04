import { memo, NamedExoticComponent, useCallback } from 'react';
import { Button, Space, Typography, Modal } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

// utils
import { useIntl } from 'umi';

// types

const { Title } = Typography;
const { confirm } = Modal;

type BNZSuccessProps = {
  onConfirmReset: () => Promise<any>;
};

const SUCCESS_ICON_COLOR = '#0070B5';
const SUCCESS_ICON_SIZE = '70px';
const TITLE_LEVEL = 3;

const BNZSuccess: NamedExoticComponent<BNZSuccessProps> = memo(
  function BNZSettingsForm({ onConfirmReset: onOk }: BNZSuccessProps) {
    const intl = useIntl();

    const showConfirm = useCallback(
      () =>
        confirm({
          title: intl.formatMessage({
            id: 'pages.settings.integrations.bnz.success.edit.confirm.title',
          }),
          icon: <ExclamationCircleOutlined />,
          content: intl.formatMessage({
            id: 'pages.settings.integrations.bnz.success.edit.confirm.content',
          }),
          onOk,
        }),
      [onOk],
    );
    return (
      <Space
        style={{ width: '100%' }}
        direction="vertical"
        size="middle"
        align="center"
      >
        <CheckCircleOutlined
          style={{
            fontSize: SUCCESS_ICON_SIZE,
            color: SUCCESS_ICON_COLOR,
          }}
        />
        <Title level={TITLE_LEVEL}>
          {intl.formatMessage({
            id: 'pages.settings.integrations.bnz.settingsSuccess',
          })}
        </Title>
        <Button type="primary" onClick={showConfirm}>
          {intl.formatMessage({
            id: 'pages.settings.integrations.bnz.success.edit',
          })}
        </Button>
      </Space>
    );
  },
);

export default BNZSuccess;
