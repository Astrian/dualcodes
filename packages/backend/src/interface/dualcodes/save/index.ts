import { JSON状态接口 } from '@lsby/net-core'
import { 存入数据 } from '../../../interface-action/dualcodes/save'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 存入数据())
