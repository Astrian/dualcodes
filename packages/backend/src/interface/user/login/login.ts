import { JSON状态接口 } from '@lsby/net-core'
import { 登录 } from '../../../interface-action/user/login'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 登录())
