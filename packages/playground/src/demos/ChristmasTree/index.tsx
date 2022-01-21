/**
 * 圣诞树动画
 * @filename: package/packages/playground/src/demos/ChristmasTree/index.tsx
 * @author: Mr Prince
 * @date: 2022-10-02 10:17:13
 */
import './index.less';

const ChristmasTree = () => {
  return (
    <ul className="tree">
      <li className="star"></li>
      {Array.from({ length: 129 }, (_, i) => {
      {/* @ts-ignore */}
        return <li key={i} style={{ '--i': `${i}` }}></li>
      })}
    </ul>
  );
};

export default ChristmasTree;
