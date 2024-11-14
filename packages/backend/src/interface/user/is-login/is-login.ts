import { JSON状态接口 } from '@lsby/net-core'
import { 用户已登录 } from '../../../interface-action/user/is-login'
import 接口描述 from './type'

export default new JSON状态接口<typeof 接口描述>(接口描述, new 用户已登录())
