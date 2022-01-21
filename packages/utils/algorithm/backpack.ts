/**
 * 0-1背包问题
 * @filename: backpack.ts
 * @author: Mr Prince
 * @date: 2021-06-14 15:54:51
 */
function backpack(values: number[], weights: number[], capacity: number): number {
  if (values.length != weights.length) {
    throw new Error('Not valid');
  }

  // TODO 想一想要求刚好装满
  // 只需要把初始条件改成负无穷就可以

  // dp[i][j] 表示最大承重为j,有i件物品可选时的最大价值
  let dp: number[][] = new Array(values.length + 1);
  for (let i = 0; i <= values.length; i++) {
    dp[i] = new Array(capacity + 1).fill(0);
  }

  for (let i = 1; i <= values.length; i++) {
    for (let j = 1; j <= capacity; j++) {
      if (j < weights[i - 1]) {
        // 放不下
        dp[i][j] = dp[i - 1][j];
      } else {
        // dp[i - 1][j] 不放，还是原来的价值
        // chooseValue 放，但是前面的重量上限要降低

        // 能放的情况下，是否能够比之前的价值高
        let chooseValue = values[i - 1] + dp[i - 1][j - weights[i - 1]];

        dp[i][j] = Math.max(dp[i - 1][j], chooseValue);
      }
    }
  }

  return dp[values.length][capacity];
}

export default backpack;
