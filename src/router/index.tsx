import loadable from '@loadable/component';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { getCookie } from '@/utils/StorageValue';

const LayoutHome = loadable(() => import('@/Layout'));
// const Home = loadable(() => import('@/pages/Home'));
const Login = loadable(() => import('@/pages/Login'));
const NotFoundPage = loadable(() => import('@/pages/NotFoundPage'));
const List = loadable(() => import('@/pages/List'));
const MenuManagers = loadable(() => import('@/pages/menu-manager'));

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
        element: <MenuManagers />,
      },
      {
        path: '/menu-manager/menu',
        element: <MenuManagers />,
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
