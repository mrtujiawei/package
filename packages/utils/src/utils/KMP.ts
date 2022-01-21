/**
 * 利用匹配失败后的信息
 * 尽量减少模式串与主串的匹配次数以达到快速匹配的目的
 */
function KMP(origin: string, target: string, startIndex = 0) {
  if ('' == target) {
    return startIndex;
  }
  const next = getNext(target);

  for (let i = startIndex, p = 0; i < origin.length; i++) {
    const originValue = origin[i];
    let targetValue = target[p];
    while (0 < p && originValue != targetValue) {
      p = next[p - 1];
      targetValue = target[p];
    }
    if (originValue == targetValue) {
      p++;
      if (p == target.length) {
        return i - target.length + 1;
      }
    }
  }

  return -1;
}

/**
 * next 数组
 * KMP 优化的关键
 */
function getNext(target: string) {
  const next: number[] = new Array(target.length);
  next[0] = 0;

  for (let i = 1, prefix = 0; i < target.length; i++) {
    const ch = target[i];
    while (prefix > 0 && target[prefix] != ch) {
      prefix = next[prefix - 1];
    }
    if (target[prefix] == ch) {
      prefix++;
    }
    next[i] = prefix;
  }

  return next;
}

export default KMP;
