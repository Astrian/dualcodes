import { Cron抽象类 } from '@lsby/ts-cron'
import { Global } from '../global/global'

class 定时任务实现 extends Cron抽象类 {
  override getName(): string {
    return '整点报时'
  }
  override async getCron(): Promise<`${string} ${string} ${string} ${string} ${string} ${string}`> {
    return '0 0 * * * *'
  }
  override async run(): Promise<void> {
    var log = (await Global.getItem('log')).extend('整点报时')
    await log.debug('我的天啊你看看都%o点了', new Date().getHours())
  }
}

export var onTimeAlarm = new 定时任务实现()
