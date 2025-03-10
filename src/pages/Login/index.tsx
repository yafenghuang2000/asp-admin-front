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
    if (!value || value.length < 6 || value.length > 8) return 'poor'; // 长度不符合要求，直接返回弱

    // 判断字符种类
    const hasNumber = /\d/.test(value); // 包含数字
    const hasLowercase = /[a-z]/.test(value); // 包含小写字母
    const hasUppercase = /[A-Z]/.test(value); // 包含大写字母
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value); // 包含特殊字符

    // 纯数字
    if (hasNumber && !hasLowercase && !hasUppercase && !hasSpecialChar) return 'poor';

    // 数字 + 小写字母
    if (hasNumber && hasLowercase && !hasUppercase && !hasSpecialChar) return 'pass';

    // 数字 + 小写字母 + 大写字母
    if (hasNumber && hasLowercase && hasUppercase && !hasSpecialChar) return 'ok';

    // 数字 + 小写字母 + 大写字母 + 特殊字符
    if (hasNumber && hasLowercase && hasUppercase && hasSpecialChar) return 'excellent';

    return 'poor'; // 其他情况返回弱
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
                    if (status === 'excellent') {
                      return (
                        <div style={{ color: token.colorSuccess, fontWeight: 'bold' }}>
                          密码强度：超强
                        </div>
                      );
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
                  {
                    min: 6,
                    message: '密码长度不能少于6位！',
                  },
                  {
                    max: 8,
                    message: '密码长度不能超过8位！',
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
