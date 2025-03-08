import loadable from '@loadable/component';
import { createBrowserRouter, redirect } from 'react-router-dom';

const LayoutHome = loadable(() => import('@/Layout'));
const Home = loadable(() => import('@/pages/Home'));
const Login = loadable(() => import('@/pages/Login'));
const NotFoundPage = loadable(() => import('@/pages/NotFoundPage'));

const isUserAuthenticated = () => {
  const user = 'admin';
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
