/**
 * 最长公共子序列
 * @filename: longestCommonSubsequence.ts
 * @author: Mr Prince
 * @date: 2021-06-13 14:07:06
 */
function longestCommonSubsequence<T>(sequence1: T[], sequence2: T[]): number {
  let dp: number[][] = new Array(sequence1.length + 1);
  for (let i = 0; i <= sequence1.length; i++) {
    dp[i] = new Array(sequence2.length + 1);
  }

  for (let i = 0; i <= sequence1.length; i++) {
    dp[i][0] = 0;
  }

  for (let j = 0; j <= sequence2.length; j++) {
    dp[0][j] = 0;
  }

  for (let i = 1; i <= sequence1.length; i++) {
    for (let j = 1; j <= sequence2.length; j++) {
      // 状态转移方程
      if (sequence1[i - 1] == sequence2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[sequence1.length][sequence2.length];
}
