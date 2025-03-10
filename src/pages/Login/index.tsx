import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { theme } from 'antd';
import { setCookie } from '@/utils/cookies';
import TrackingService from '@/utils/trackingService';
import { useGoHome } from '@/hooks/routerHooks';
import './index.scss';

const Login: React.FC = () => {
  const { token } = theme.useToken();
  const goHome = useGoHome();

  const getStatus = (value: string) => {
    if (value && value.length > 12) {
      return 'ok';
    }
    if (value && value.length > 6) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = (values: { username: string; password: string }) => {
    console.log('Success:', values);
    setCookie({
      key: 'user',
      value: values.username,
      options: { expires: 7, path: '/', sameSite: 'Lax' },
    });
    goHome();
    TrackingService.trackEvent('click', { buttonId: 'submit-button', openId: values.username });
  };

  return (
    <div className='xms-login-container'>
      <ProConfigProvider hashed={false}>
        <div className='xms-login'>
          <LoginForm title='Github' subTitle='全球最大的代码托管平台' onFinish={onFinish}>
            <div className='xms-login-form'>
              <ProFormText
                name='username'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'用户名: admin'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name='password'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                  statusRender: (value) => {
                    const status = getStatus(value as string);
                    if (status === 'pass') {
                      return <div style={{ color: token.colorWarning }}>密码强度：中</div>;
                    }
                    if (status === 'ok') {
                      return <div style={{ color: token.colorSuccess }}>密码强度：强</div>;
                    }
                    return <div style={{ color: token.colorError }}>密码强度：弱</div>;
                  },
                }}
                placeholder={'密码:123456'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </div>
          </LoginForm>
        </div>
      </ProConfigProvider>
    </div>
  );
};

export default Login;
