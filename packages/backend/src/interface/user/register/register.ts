import { JSON状态接口 } from '@lsby/net-core'
import { 注册 } from '../../../interface-action/user/register'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 注册())
