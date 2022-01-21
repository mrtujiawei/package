/**
 * 导航栏
 * @filename: packages/react-components/src/components/NavBar/index.tsx
 * @author: Mr Prince
 * @date: 2022-09-28 13:53:39
 */
import classnames from 'classnames';
import {
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import Arrow from './Arrow';

export interface NavBarProps {
  /**
   * 中间的标题
   */
  title?: ReactNode;

  /**
   * 是否固定在顶部
   */
  fixed?: boolean;

  /**
   * 修改定位层级
   */
  zIndex?: number;

  /**
   * 左侧节点
   */
  left?: ReactNode;

  /**
   * 右侧节点
   */
  right?: ReactNode;

  /**
   * 是否显示左箭头
   */
  leftArrow?: boolean;

  /**
   * 是否在标签位置生成一个同样高度的容器占位
   */
  placeholder?: boolean;

  /**
   * 是否留安全顶部距离
   */
  safeAreaInsetTop?: boolean;

  /**
   * 左侧点击事件
   */
  onClickLeft?: MouseEventHandler<HTMLDivElement>;

  /**
   * 右侧点击事件
   */
  onClickRight?: MouseEventHandler<HTMLDivElement>;
}

const NavBar: FC<NavBarProps> = (props) => {
  const [height, setHeight] = useState(0);
  const navBar = useRef<HTMLDivElement>(null);

  const hasLeft = () => {
    if (props.leftArrow || props.left) {
      return true;
    }
    return false;
  };

  const genLeft = () => {
    return [
      props.leftArrow && (
        <div key="0" className="nav-bar__arrow">
          <Arrow></Arrow>
        </div>
      ),
      <div key={1}>{props.left}</div>,
    ];
  };

  const genRight = () => {
    return props.right;
  };

  useEffect(() => {
    if (props.placeholder && props.fixed) {
      let flag = true;
      const updateHeight = () => {
        if (flag) {
          setHeight(navBar.current?.getBoundingClientRect?.()?.height || 0);
        }
      };
      updateHeight();
      setTimeout(updateHeight, 100);
      return () => {
        flag = false;
      };
    }
  }, [props.placeholder, props.fixed]);

  const NavBar = (
    <div
      ref={navBar}
      style={{ zIndex: props.zIndex }}
      className={classnames([
        {
          'nav-bar': true,
          'nav-bar__text': true,
          'nav-bar--fixed': props.fixed,
          'nav-bar--safe-area-inset-top': props.safeAreaInsetTop,
        },
      ])}
    >
      <div className={'nav-bar__content'}>
        {hasLeft() && (
          <div
            className={classnames('nav-bar__left')}
            onClick={props.onClickLeft}
          >
            {genLeft()}
          </div>
        )}
        <div className={classnames(['nav-bar__title'])}>{props.title}</div>
        <div
          className={classnames('nav-bar__right')}
          onClick={props.onClickRight}
        >
          {genRight()}
        </div>
      </div>
    </div>
  );

  if (props.placeholder && props.fixed) {
    return (
      <div className="nav-bar__placeholder" style={{ height }}>
        {NavBar}
      </div>
    );
  }

  return NavBar;
};

export default NavBar;
