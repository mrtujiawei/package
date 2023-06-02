import { Link } from 'react-router-dom';
import styles from './styles.module.less';

const Home = () => {
  return (
    <>
      <nav className={styles.nav}>
        <Link to="/nav-bar">导航栏</Link>
        <Link to="/toast">提示</Link>
      </nav>
    </>
  );
};

export default Home;
