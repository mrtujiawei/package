/**
 * 汉诺塔
 * @filename: Hanoi.js
 * @author: Mr Prince
 * @date: 2021-06-10 20:08:06
 */
function Hanoi(number: number, plant1: string, plant2: string, plant3: string) {
  if (1 == number) {
    console.log(`(${plant1}): ${number} => ${plant3};`);
  } else {
    // 这里是递归调用
    // 将n-1个盘子从1移动到2
    Hanoi(number - 1, plant1, plant3, plant2)
    // 将第n个盘子从1移动到3
    console.log(`(${plant1}): ${number} => ${plant3};`);
    // 将n-1个盘子动2移动到3
    Hanoi(number - 1, plant2, plant1, plant3);
  }
}

export default Hanoi;
