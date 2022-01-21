/**
 * 最大子序列和
 * @filename: maxSubArraySum.ts
 * @author: Mr Prince
 * @date: 2021-06-12 15:17:49
 */
function maxSubArraySum(arr: number[]): number {
  function sum(arr: number[], begin: number, end: number): number {
    if (end - begin < 2) {
      return arr[begin];
    }
    let middle = (begin + end) >> 1;

    let bothSideMax = getBothSideMax(arr, begin, middle, end);
    let middleMax = getMiddleMax(arr, begin, middle, end);

    return Math.max(bothSideMax, middleMax);
  }

  // 左右两个区间单独的最大和
  function getBothSideMax(arr: number[], begin: number, middle: number, end: number): number {
    let leftMax = sum(arr, begin, middle);
    let rightMax = sum(arr, middle, end);

    let bothSideMax = Math.max(leftMax, rightMax);

    return bothSideMax;
  }

  // 最大和夹在两个区间中间
  function getMiddleMax(arr: number[], begin: number, middle: number, end: number): number {
    let leftMax = Number.MIN_SAFE_INTEGER;
    let rightMax = Number.MIN_SAFE_INTEGER;

    let leftSum = 0;
    for (let i = middle - 1; i >= begin; i--) {
      leftSum += arr[i];
      if (leftSum > leftMax) {
        leftMax = leftSum;
      }
    }

    let rightSum = 0;
    for (let i = middle; i < end; i++) {
      rightSum += arr[i];
      if (rightSum > rightMax) {
        rightMax = rightSum;
      }
    }

    return leftMax + rightMax;
  }

  return sum(arr, 0, arr.length);
}

export default maxSubArraySum;

/**
 * 动态规划版
 * @param {number[]} nums
 * @return {number}
 */
// var maxSubArray = function(nums) {
//     let dp = new Array(nums.length);
//     dp[0] = nums[0];
// 
//     for (let i = 1; i < nums.length; i++) {
//         if (dp[i - 1] > 0) {
//             dp[i] = nums[i] + dp[i - 1];
//         } else {
//             dp[i] = nums[i];
//         }
//     }
// 
//     return Math.max(...dp);
// };
