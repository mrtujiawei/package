import { createBrowserRouter } from 'react-router-dom';
import NavBarDemo from '../demos/NavBar';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/nav-bar',
    element: <NavBarDemo></NavBarDemo>,
  },
]);

export default router;
