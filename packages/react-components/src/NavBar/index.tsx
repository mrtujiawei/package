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

export * from './types';

export const NavBar: FC<NavBarProps> = (props) => {
  const bem = createBEM('nav-bar');
  const {
    fixed = true,
    safeAreaInsetTop = true,
    border = true,
    leftArrow = true,
    placeholder = true,
  } = props;

  return (
    <div
      className={classNames({
        ['safe-area-inset-top']: safeAreaInsetTop,
        [bem('placeholder')]: placeholder,
      })}
    >
      <div
        style={{ zIndex: props.zIndex }}
        className={classNames([
          bem(),
          bem('text'),
          {
            [bem('', 'fixed')]: fixed,
            ['safe-area-inset-top']: safeAreaInsetTop,
            [bem('', 'border')]: border,
          },
        ])}
      >
        <div className={bem('content')}>
          {!!(leftArrow || props.left) && (
            <div
              className={classNames(bem('left'))}
              onClick={props.onClickLeft}
            >
              {[
                leftArrow && (
                  <div key={0} className={bem('', 'arrow')}>
                    <Arrow></Arrow>
                  </div>
                ),
                <div key={1}>{props.left}</div>,
              ]}
            </div>
          )}
          <div
            className={classNames([bem('title')])}
            onClick={props.onClickCenter}
          >
            {props.children}
          </div>
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
