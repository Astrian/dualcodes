import { 接口测试 } from '@lsby/net-core'
import assert from 'assert'
import { randomUUID } from 'crypto'
import { clearDB } from '../../../../script/db/clear-db'
import { Global } from '../../../global/global'
import { 请求用例 } from '../../../tools/request'
import 接口描述 from './type'

var name = 'admin'
var pwd = '123456'
export default new 接口测试(
  async (): Promise<void> => {
    var db = (await Global.getItem('kysely')).获得句柄()
    await clearDB(db)
    await db.insertInto('user').values({ id: randomUUID(), name: name, pwd: pwd }).execute()
  },

  async (): Promise<object> => {
    return 请求用例(接口描述, {}, { 接口: '/api/user/login', 用户名: name, 密码: pwd, 凭据属性: 'token' })
  },

  async (中置结果: object): Promise<void> => {
    var log = await Global.getItem('log')

    var 正确结果 = 接口描述.获得正确结果类型().safeParse(中置结果)
    var 错误结果 = 接口描述.获得错误结果类型().safeParse(中置结果)
    if (!正确结果.success && !错误结果.success) {
      await log.err('没有通过返回值检查: %o, %o', 正确结果.error.errors, 错误结果.error.errors)
      throw new Error('非预期的返回值')
    }

    if (!正确结果.success) throw new Error('应该调用成功, 实际调用出错')
    var 结果 = 正确结果.data

    assert.equal(结果.data.isLogin, true)
  },
)
