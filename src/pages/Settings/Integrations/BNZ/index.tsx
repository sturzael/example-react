import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';

//components
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import BNZSettingsForm from './components/BNZSettingsForm';
import BNZSettingsSuccess from './components/BNZSettingsSuccess';

//api
import {
  bnzConnect,
  getAccounts,
  getSettings,
  postSettings,
} from '@/services/BNZ/service';
// utils
import { message } from 'antd';

//types
import { BNZAccount, BNZSettings } from '@/services/BNZ/data';
import { merge } from 'lodash';

const BNZ_CONNECT_STEP = 1;
const SELECT_BANK_ACCOUNT_STEP = 2;
const BNZ_CONNECT_OAUTH_WINDOW_OPTIONS =
  'location=yes,height=570,width=520,scrollbars=yes,status=yes';

const BNZ: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [accounts, setAccounts] = useState<BNZAccount[]>([]);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  const [settings, setSettings] = useState<BNZSettings>({} as BNZSettings);
  const [bnzRedirect, setBnzRedirect] = useState<string | false>(false);
  const [isFetchingBnzConnect, setIsFetchingBnzConnect] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const bnzOauthWindow = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    getSettings()
      .then(({ data }) => {
        const { apiKey, clientId, clientSecret, tokenRefreshable, operations } =
          data;
        const hasApiKeySettings = !!apiKey && !!clientId && !!clientSecret;
        const hasConnected = !!tokenRefreshable;
        const hasAccountSetup =
          !!operations?.trustTransactionImport?.bankAccount;

        if (data) {
          setSettings(data);
        }

        if (hasAccountSetup) {
          setIsEditing(false);
        }

        if (hasApiKeySettings && hasConnected) {
          setStep(SELECT_BANK_ACCOUNT_STEP);
        }

        if (!hasConnected && hasApiKeySettings) {
          setStep(BNZ_CONNECT_STEP);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setPageLoading(false));
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    if (step === SELECT_BANK_ACCOUNT_STEP) {
      setIsFetchingAccounts(true);
      getAccounts()
        .then(({ data }) => {
          setAccounts(data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsFetchingAccounts(false);
        });
    }
    if (step === BNZ_CONNECT_STEP) {
      setIsFetchingBnzConnect(true);
      bnzConnect()
        .then(({ data: { url } }) => {
          setBnzRedirect(url);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsFetchingBnzConnect(false);
        });
    }
  }, [step, isEditing]);

  const incrementStep = useCallback(() => {
    // if step is last step, don't incement it
    if (step === SELECT_BANK_ACCOUNT_STEP) return;

    setStep(step + 1);
  }, [step]);

  const decrementStep = useCallback(() => {
    // if step is 0, don't decrement it
    if (!step) return;

    setStep(step - 1);
  }, [step]);

  const saveSettings = useCallback(
    async (newSettings: Partial<BNZSettings>) => {
      try {
        setFormLoading(true);

        // merge to recursively spread values; right side takes precedence
        await postSettings(merge(settings, newSettings));
      } catch (error) {
        console.error(error);
      } finally {
        setFormLoading(false);
      }
    },
    [settings, setFormLoading],
  );

  const onSettingsFinish = useCallback(
    async (formValues) => {
      try {
        // if resetting first values reset bank account to avoid any potential mismatch
        await saveSettings({
          ...formValues,
          operations: {
            trustTransactionImport: {
              bankAccount: '',
            },
          },
          tokenRefreshable: false,
        });

        message.success(
          intl.formatMessage({
            id: 'pages.settings.integrations.post.successMessage',
            defaultMessage: 'Integration settings saved',
          }),
        );

        incrementStep();
      } catch (error) {
        console.error(error);
      }
    },
    [settings, incrementStep],
  );

  const onBankAccountFinish = useCallback(
    async ({ bankAccount }: { bankAccount: string }) => {
      try {
        await saveSettings({
          operations: { trustTransactionImport: { bankAccount } },
        });

        message.success(
          intl.formatMessage({
            id: 'pages.settings.integrations.bnz.bankAccount.successMessage',
            defaultMessage: 'Bank account settings saved',
          }),
        );

        setIsEditing(false);
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const resetIntegrationSettings = useCallback(async () => {
    setStep(0);
    setIsEditing(true);
  }, [settings]);

  const onBnzConnect = useCallback(async () => {
    if (!bnzRedirect) return;

    bnzOauthWindow.current = window.open(
      bnzRedirect,
      'BNZOauth',
      BNZ_CONNECT_OAUTH_WINDOW_OPTIONS,
    );

    setIsConnecting(true);
  }, [bnzRedirect]);

  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'pages.settings.integrations.bnz.title',
      })}
      onBack={() => window.history.back()}
    >
      <ProCard loading={pageLoading}>
        {!isEditing ? (
          <BNZSettingsSuccess onConfirmReset={resetIntegrationSettings} />
        ) : (
          <BNZSettingsForm
            currentStep={step}
            loading={{
              form: formLoading,
              accounts: isFetchingAccounts,
              bnzConnect: isFetchingBnzConnect || isConnecting,
              isConnecting,
            }}
            accounts={accounts}
            onFinish={onBankAccountFinish}
            onSettingSubmit={onSettingsFinish}
            decrementStep={decrementStep}
            onBnzConnect={onBnzConnect}
          />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default BNZ;
