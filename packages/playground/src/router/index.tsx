import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ListDemo from '../demos/List';
import NavBarDemo from '../demos/NavBar';
import OverlayDemo from '../demos/Overlay';
import ToastDemo from '../demos/Toast';
import TableDemo from '../demos/Table';
import SwitchContainerDemo from '../demos/SwitchContainer';
import SwitchBackContainerDemo from '../demos/SwitchBackContainer';
import Home from '../pages/Home';
import BoardcastChannel from '../demos/BoardcastChannel';

type Route = RouteObject & {
  name?: string;
};

export const routes: Route[] = [
  {
    path: '/',
    name: '',
    element: <Home />,
  },
  {
    path: '/nav-bar',
    name: '导航栏',
    element: <NavBarDemo></NavBarDemo>,
  },
  {
    path: '/overlay',
    name: '遮罩层',
    element: <OverlayDemo />,
  },
  {
    path: '/toast',
    name: '轻提示',
    element: <ToastDemo />,
  },
  {
    path: '/list',
    name: '列表',
    element: <ListDemo></ListDemo>,
  },
  {
    path: '/table',
    name: '表格',
    element: <TableDemo />,
  },
  {
    path: '/switch-container',
    name: '过渡',
    element: <SwitchContainerDemo />,
  },
  {
    path: '/switch-back-container',
    name: '返回过渡',
    element: <SwitchBackContainerDemo />,
  },
  {
    path: '/boardcast-channel',
    name: '广播',
    element: <BoardcastChannel />,
  },
];

const router = createBrowserRouter(routes);

export default router;
