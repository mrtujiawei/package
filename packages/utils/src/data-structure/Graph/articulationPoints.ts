/**
 * 关键点
 *
 * @filename packages/utils/src/data-structure/Graph/articulationPoints.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-21 17:13:12
 */
type VisitMetadata = {
  discoveryTime: number;
  lowDiscoveryTime: number;
  independentChildrenCount: number;
};

/**
 * 无向图中的关键点
 * 移除该点后，会形成多个图
 *
 * 关键点的条件
 * 1. 根结点且至少有两个子节点
 * 2. 不是根结点，且子节点不能访问会该节点
 */
export const articulationPoints = (adjacent: number[][]) => {
  const visited = new Map<number, VisitMetadata>();
  const articulationPoints: number[] = [];
  let discoveryTime = 0;

  const start = 0;
  const dfs = (current: number, previous: number) => {
    // enter
    discoveryTime += 1;
    visited.set(current, {
      discoveryTime,
      lowDiscoveryTime: discoveryTime,
      independentChildrenCount: 0,
    });

    if (previous != -1) {
      visited.get(previous)!.independentChildrenCount++;
    }

    adjacent[current].forEach((value, next) => {
      // dfs
      if (value == Infinity || visited.has(next)) {
        return;
      }
      dfs(next, current);
    });

    // leave
    if (previous == -1) {
      return;
    }

    const lowestDiscoveryTime = adjacent[current].reduce(
      (lowestDiscoveryTime, value, index) => {
        if (index == previous || value == Infinity) {
          return lowestDiscoveryTime;
        }
        return Math.min(
          lowestDiscoveryTime,
          visited.get(index)!.lowDiscoveryTime
        );
      },
      visited.get(current)!.lowDiscoveryTime
    );

    visited.get(current)!.lowDiscoveryTime = lowestDiscoveryTime;

    if (previous == start) {
      if (visited.get(previous)!.independentChildrenCount >= 2) {
        articulationPoints.push(previous);
      }
    } else {
      const currentLowDiscoveryTime = visited.get(current)!.lowDiscoveryTime;

      const parentDiscoveryTime = visited.get(previous)!.discoveryTime;
      if (parentDiscoveryTime <= currentLowDiscoveryTime) {
        articulationPoints.push(previous);
      }
    }
  };

  dfs(start, -1);

  return articulationPoints;
};
