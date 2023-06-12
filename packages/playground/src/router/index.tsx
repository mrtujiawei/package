import { createBrowserRouter, RouteObject } from 'react-router-dom';
// import ListDemo from '../demos/List';
// import NavBarDemo from '../demos/NavBar';
// import OverlayDemo from '../demos/Overlay';
// import TableDemo from '../demos/Table';
import Home from '../pages/Home';

type Route = RouteObject & {
  name?: string;
};

export const routes: Route[] = [
  {
    path: '/',
    name: '',
    element: <Home />,
  },
  // {
  //   path: '/nav-bar',
  //   name: '导航栏',
  //   element: <NavBarDemo></NavBarDemo>,
  // },
  // {
  //   path: '/overlay',
  //   name: '遮罩层',
  //   element: <OverlayDemo />,
  // },
  // {
  //   path: '/table',
  //   name: '表格',
  //   element: <TableDemo />,
  // },
  // {
  //   path: '/list',
  //   name: '列表',
  //   element: <ListDemo></ListDemo>,
  // },
];

const router = createBrowserRouter(routes);

export default router;
