/**
 * 雪花算法
 * @filename packages/utils/src/utils/SnowFlake.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-15 09:12:53
 */

class SnowFlake {
  /**
   * 起始时间戳
   */
  private static readonly START_STMP = 0;

  /**
   * 序列号占用的位数
   */
  private static readonly SEQUENCE_BIT = 12;

  /**
   * 机器标识占用的位数
   */
  private static readonly MACHINE_BIT = 5;

  /**
   * 数据中心占用的位数
   */
  private static readonly DATA_CENTER_BIT = 5;

  /**
   * 每一部分的最大值
   */
  private static readonly MAX_DATACENTER_NUM =
    (1 << SnowFlake.DATA_CENTER_BIT) - 1;
  private static readonly MAX_MACHINE_NUM = (1 << SnowFlake.MACHINE_BIT) - 1;
  private static readonly MAX_SEQUENCE = (1 << SnowFlake.SEQUENCE_BIT) - 1;

  /**
   * 每一部分向左的位移
   */
  private static readonly MACHINE_LEFT = SnowFlake.SEQUENCE_BIT;
  private static readonly DATA_CENTER_LEFT =
    SnowFlake.SEQUENCE_BIT + SnowFlake.MACHINE_BIT;
  private static readonly TIMESTMP_LEFT =
    SnowFlake.DATA_CENTER_LEFT + SnowFlake.DATA_CENTER_BIT;

  /**
   * 数据中心
   */
  private dataCenterId: number;

  /**
   * 机器标识
   */
  private machineId: number;

  /**
   * 序列号
   */
  private sequence = 0;

  /**
   * 上一次时间戳
   */
  private lastStamp = -1;

  /**
   * @param dataCenterId [0, 1 << 5)
   * @param machineId [0, 1 << 5)
   */
  constructor(dataCenterId: number, machineId: number) {
    if (dataCenterId > SnowFlake.MAX_DATACENTER_NUM || dataCenterId < 0) {
      throw new RangeError(
        `dataCenterId can't be greater than ${SnowFlake.MAX_DATACENTER_NUM} or less than 0`
      );
    }
    if (machineId > SnowFlake.MAX_MACHINE_NUM || machineId < 0) {
      throw new RangeError(
        `machineId can't be greater than ${SnowFlake.MAX_MACHINE_NUM} or less than 0`
      );
    }
    this.dataCenterId = dataCenterId;
    this.machineId = machineId;
  }

  /**
   * 生成下一个id
   */
  public generateNextId() {
    let currStamp = this.getNewStamp();
    if (currStamp < this.lastStamp) {
      throw new RangeError('Clock moved backwards.  Refusing to generate id');
    }

    if (currStamp == this.lastStamp) {
      // 相同毫秒内，序列号自增
      this.sequence = (this.sequence + 1) & SnowFlake.MAX_SEQUENCE;
      // 同一毫秒的序列数已经达到最大
      if (this.sequence == 0) {
        currStamp = this.getNextStamp();
      }
    } else {
      // 不同毫秒内，序列号置为0
      this.sequence = 0;
    }

    this.lastStamp = currStamp;

    return (
      // 时间戳部分
      (BigInt(currStamp - SnowFlake.START_STMP) << BigInt(SnowFlake.TIMESTMP_LEFT)) |
      // 数据中心部分
      BigInt(this.dataCenterId << SnowFlake.DATA_CENTER_LEFT) |
      // 机器标识部分
      BigInt(this.machineId << SnowFlake.MACHINE_LEFT) |
      // 序列号部分
      BigInt(this.sequence)
    )
    // return (
    //   // 时间戳部分
    //   ((currStamp - SnowFlake.START_STMP) << SnowFlake.TIMESTMP_LEFT) |
    //   // 数据中心部分
    //   (this.dataCenterId << SnowFlake.DATA_CENTER_LEFT) |
    //   // 机器标识部分
    //   (this.machineId << SnowFlake.MACHINE_LEFT) |
    //   // 序列号部分
    //   this.sequence
    // );
  }

  private getNextStamp() {
    let stamp = this.getNewStamp();
    if (stamp == this.lastStamp) {
      stamp++;
    }
    return stamp;
  }

  /**
   * 当前毫秒数
   */
  private getNewStamp() {
    return new Date().getTime();
  }
}

export default SnowFlake;
