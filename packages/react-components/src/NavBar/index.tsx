/**
 * 导航栏
 *
 * @filename: src/components/NavBar/index.tsx
 * @author: Mr Prince
 * @date: 2022-09-28 13:53:39
 */
import { createBEM } from '@mrtujiawei/utils';
import classNames from 'classnames';
import { FC } from 'react';
import Arrow from '../icons/Arrow';
import { NavBarProps } from './types';

const NavBar: FC<NavBarProps> = (props) => {
  const bem = createBEM('nav-bar');

  return (
    <div className={props.placeholder ? bem('placeholder') : ''}>
      <div
        style={{ zIndex: props.zIndex }}
        className={classNames([
          {
            [bem()]: true,
            [bem('text')]: true,
            [bem('', 'fixed')]: props.fixed,
            ['safe-area-inset-top']: props.safeAreaInsetTop,
          },
        ])}
      >
        <div className={bem('content')}>
          {!!(props.leftArrow || props.left) && (
            <div
              className={classNames(bem('left'))}
              onClick={props.onClickLeft}
            >
              {[
                props.leftArrow && (
                  <div key={0} className={bem('', 'arrow')}>
                    <Arrow></Arrow>
                  </div>
                ),
                <div key={1}>{props.left}</div>,
              ]}
            </div>
          )}
          <div className={classNames([bem('title')])}>{props.title}</div>
          <div
            className={classNames(bem('right'))}
            onClick={props.onClickRight}
          >
            {props.right}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
