import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persist } from './store';
import routers from './router';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>
      <React.StrictMode>
        <Suspense fallback={<div>...加载中</div>}>
          <RouterProvider router={routers} />
        </Suspense>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
);
