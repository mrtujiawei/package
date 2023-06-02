import { NavLink } from 'react-router-dom';
import { routes } from '../../router';
import styles from './styles.module.less';

const Home = () => {
  return (
    <>
      <nav className={styles.nav}>
        {routes.map(
          (route) =>
            route.name && (
              <NavLink key={route.path!} to={route.path!}>
                {route.name}
              </NavLink>
            )
        )}
      </nav>
    </>
  );
};

export default Home;
