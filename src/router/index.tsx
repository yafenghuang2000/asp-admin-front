import { lazy } from 'react';
import { createHashRouter, redirect } from 'react-router-dom';

const LayoutHome = lazy(() => import('@/Layout'));
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const isUserAuthenticated = () => {
  const user = 'admin';
  if (!user) {
    return redirect('/login');
  }
  return null;
};

const routers = createHashRouter([
  {
    path: '/',
    element: <LayoutHome />,
    loader: isUserAuthenticated,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default routers;
