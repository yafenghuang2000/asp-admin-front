import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ZhCN from 'antd/locale/zh_CN';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persist } from './store';
import App from './App';
import './index.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>
      <React.Suspense>
        <ConfigProvider locale={ZhCN}>
          <App />
        </ConfigProvider>
      </React.Suspense>
    </PersistGate>
  </Provider>,
);
