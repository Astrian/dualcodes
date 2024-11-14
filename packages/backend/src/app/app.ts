import { 服务器 } from '@lsby/net-core'
import { onTimeAlarm } from '../cron/on-time-alarm'
import { Global } from '../global/global.js'
import { interfaceList } from '../interface/interface-list'

export class App {
  async run(): Promise<void> {
    var log = (await Global.getItem('log')).extend('service')
    var env = await (await Global.getItem('env')).获得环境变量()

    var cron = await Global.getItem('cron')
    await cron.执行([onTimeAlarm])

    var service = new 服务器(interfaceList, env.APP_PORT, env.WEB_PATH)
    var serviceInfo = await service.run()
    await log.debug('服务器地址: %O', serviceInfo.ip)
  }
}
