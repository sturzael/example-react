import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import typAxios from '@/utils/typAxios';

type SecurityLayoutProps = {
  loading?: boolean;
  currentUser?: CurrentUser;
} & ConnectProps;

type SecurityLayoutState = {
  isReady: boolean;
};

class SecurityLayout extends React.Component<
  SecurityLayoutProps,
  SecurityLayoutState
> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  async componentDidMount() {
    //FIXME - Not a very clean way
    try {
      await typAxios.post('/api/login_check', {
        username: 'terence',
        password: 'AY_bouw7sout@waw',
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isLogin = currentUser && currentUser.username;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
