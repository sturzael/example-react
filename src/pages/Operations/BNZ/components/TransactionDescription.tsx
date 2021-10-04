import React from 'react';
import { Row, Typography } from 'antd';
import { useIntl } from 'umi';
const { Paragraph } = Typography;

const TransactionDescription: React.FC = () => {
  const intl = useIntl();
  const documentationLink =
    'https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg';

  return (
    <Row>
      <Paragraph>
        {intl.formatMessage({
          id: 'pages.operations.bnz.descriptionOne',
        })}
      </Paragraph>
      <div>
        <a
          className="example-link"
          href={intl.formatMessage({
            id: 'pages.operations.bnz.documentLink',
          })}
        >
          <img
            className="example-link-icon"
            src={documentationLink}
            alt="Process documentation"
            style={{ paddingRight: 10 }}
          />
          {intl.formatMessage({
            id: 'pages.operations.bnz.documentText',
          })}
        </a>
      </div>
    </Row>
  );
};

export default React.memo(TransactionDescription);
