import { JSON状态接口 } from '@lsby/net-core'
import { 读取数据 } from '../../../interface-action/dualcodes/load'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 读取数据())
