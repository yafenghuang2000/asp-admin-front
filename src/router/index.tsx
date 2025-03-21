import { lazy } from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { getCookie } from '@/utils/StorageValue';

const LayoutHome = lazy(() => import('@/Layout'));
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const List = lazy(() => import('@/pages/List'));
const MenuManagers = lazy(() => import('@/pages/menu-manager'));
const UserManagers = lazy(() => import('@/pages/UserManager'));

const isUserAuthenticated = () => {
  const user = getCookie('user');
  if (!user) {
    return redirect('/login');
  }
  return null;
};

const routers = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    loader: isUserAuthenticated,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu-manager/menu',
        element: <MenuManagers />,
      },
      {
        path: '/user-manager',
        element: <UserManagers />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/list',
    element: <List />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default routers;
