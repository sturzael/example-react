import { memo, NamedExoticComponent, useCallback } from 'react';
import { ProFormSelect, ProFormText, StepsForm } from '@ant-design/pro-form';
import { Button, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

// utils
import { useIntl } from 'umi';

// types
import { BNZAccount } from '@/services/BNZ/data';

type BNZFormProps = {
  currentStep: number;
  loading: {
    form: boolean;
    accounts: boolean;
    bnzConnect: boolean;
    isConnecting: boolean;
  };
  onSettingSubmit: ({
    apiKey,
    clientId,
    clientSecret,
  }) => Promise<boolean | void>;
  onBnzConnect: () => void;
  onFinish: ({ bankAccount: string }) => Promise<void>;
  accounts: BNZAccount[];
  decrementStep: () => void;
};

const BNZForm: NamedExoticComponent<BNZFormProps> = memo(function BNZForm({
  currentStep,
  loading,
  onSettingSubmit,
  onFinish,
  accounts,
  decrementStep,
  onBnzConnect,
}: BNZFormProps) {
  const intl = useIntl();

  const refresh = useCallback(() => {
    window.location.reload();
  }, []);

  const submitter = useCallback(
    ({ form, onSubmit, step }) => {
      return [
        step !== 1 && (
          <Button
            key="rest"
            onClick={() => {
              form?.resetFields();
            }}
          >
            Clear
          </Button>
        ),
        step > 0 && (
          <Button key="pre" onClick={decrementStep}>
            Previous
          </Button>
        ),
        step !== 1 && (
          <Button
            key="next"
            loading={loading.form}
            type="primary"
            onClick={() => {
              onSubmit?.();
            }}
          >
            Submit
          </Button>
        ),
      ];
    },
    [loading.form, decrementStep],
  );

  return (
    <StepsForm
      current={currentStep}
      onFinish={onFinish}
      submitter={{
        render: submitter,
      }}
      formProps={{
        validateMessages: {
          required: intl.formatMessage({
            id: 'pages.requiredField',
            defaultMessage: 'Field is required',
          }),
        },
      }}
    >
      <StepsForm.StepForm
        name="apiSettingsStep"
        title={intl.formatMessage({
          id: 'pages.settings.integrations.bnz.step1',
        })}
        onFinish={onSettingSubmit}
      >
        <ProFormText
          name="apiKey"
          label={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.apiKey',
            defaultMessage: 'Api key',
          })}
          width="md"
          tooltip={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.apiKey.tooltip',
            defaultMessage: 'Api key provided by BNZ',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.apiKey',
            defaultMessage: 'Api key',
          })}
          rules={[{ required: true }]}
        />
        <ProFormText
          name="clientId"
          label={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientId',
            defaultMessage: 'Client Id',
          })}
          width="md"
          tooltip={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientId.tooltip',
            defaultMessage: 'Client id provided by BNZ',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientId',
            defaultMessage: 'Client Id',
          })}
          rules={[{ required: true }]}
        />
        <ProFormText
          name="clientSecret"
          label={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientSecret',
            defaultMessage: 'Client Secret',
          })}
          width="md"
          tooltip={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientSecret.tooltip',
            defaultMessage: 'Client secret provided by BNZ',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.clientSecret',
            defaultMessage: 'Client Secret',
          })}
          rules={[{ required: true }]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="bnzConnectStep"
        title={intl.formatMessage({
          id: 'pages.settings.integrations.bnz.step2',
          defaultMessage: 'Bank account selection',
        })}
      >
        <Space
          size="middle"
          style={{ width: '100%' }}
          direction="vertical"
          align="center"
        >
          <Title level={3}>BNZ Connect</Title>
          {loading.isConnecting && (
            <Paragraph>
              {intl.formatMessage({
                id: 'pages.settings.integrations.bnz.step2.refreshText',
              })}
            </Paragraph>
          )}
          <Space>
            <Button
              disabled={loading.bnzConnect}
              loading={loading.bnzConnect}
              onClick={onBnzConnect}
              type="primary"
            >
              {intl.formatMessage({
                id: 'pages.settings.integrations.bnz.step2',
              })}
            </Button>
            {loading.isConnecting && (
              <Button onClick={refresh}>
                {intl.formatMessage({
                  id: 'pages.settings.integrations.bnz.step2.refresh',
                })}
              </Button>
            )}
          </Space>
        </Space>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="bankAccountStep"
        title={intl.formatMessage({
          id: 'pages.settings.integrations.bnz.step3',
          defaultMessage: 'Bank account selection',
        })}
      >
        <ProFormSelect
          label={intl.formatMessage({
            id: 'pages.settings.integrations.bnz.bankAccount',
            defaultMessage: 'Bank Account',
          })}
          name="bankAccount"
          placeholder={
            loading.accounts
              ? intl.formatMessage({
                  id: 'pages.settings.integrations.bnz.bankAccount.fetching',
                  defaultMessage: 'Fetching Accounts...',
                })
              : intl.formatMessage({
                  id: 'pages.settings.integrations.bnz.bankAccount',
                  defaultMessage: 'Bank Account',
                })
          }
          width="md"
          disabled={loading.accounts}
          options={accounts.map(({ id, nickname, accountNumberFormatted }) => ({
            value: id,
            label: `${nickname} - ${accountNumberFormatted}`,
          }))}
          rules={[{ required: true }]}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
});

export default BNZForm;
