import { NavBar } from '@mrtujiawei/react-components';
import styles from './styles.module.less';

const NavBarDemo = () => {
  return (
    <div className={styles.demo}>
      <div>被覆盖</div>
      <NavBar
        fixed
        placeholder
        leftArrow
        safeAreaInsetTop
        left={'返回'}
        onClickLeft={(event) => {
          console.log('left clicked', event);
        }}
        onClickCenter={(event) => {
          console.log('center clicked', event);
        }}
        onClickRight={(event) => {
          console.log('right clicked', event);
        }}
        right={'历史记录'}
      >
        导航栏
      </NavBar>
      <div className={styles.content}>内容区，不应该被覆盖</div>
    </div>
  );
};

export default NavBarDemo;
