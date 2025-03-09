import loadable from '@loadable/component';
import { createHashRouter, redirect } from 'react-router-dom';
import { getCookie } from '@/utils/cookies.ts';

const LayoutHome = loadable(() => import('@/Layout'));
const Home = loadable(() => import('@/pages/Home'));
const Login = loadable(() => import('@/pages/Login'));
const NotFoundPage = loadable(() => import('@/pages/NotFoundPage'));

const isUserAuthenticated = () => {
  const user = getCookie('user');
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
