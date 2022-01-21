import { NavBar } from '@mrtujiawei/react-components';

const NavBarDemo = () => {
  return (
    <div style={{ height: 10000, background: 'linear-gradient(#000, blue)' }}>
      <NavBar
        left={<div>左边</div>}
        leftArrow={true}
        right={<div>右边</div>}
        title={'Hello World'}
        fixed={true}
        placeholder={true}
      />
      <div style={{ color: '#fff' }}>内容区域</div>
    </div>
  );
};

export default NavBarDemo;
