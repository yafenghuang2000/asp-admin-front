import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import routers from './router';
const App: React.FC = () => {
  return (
    <Suspense fallback={<div>...加载中</div>}>
      <RouterProvider router={routers} />
    </Suspense>
  );
};

export default App;
