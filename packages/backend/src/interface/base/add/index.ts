import { JSON状态接口 } from '@lsby/net-core'
import { 加法 } from '../../../interface-action/base/add'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 加法())
