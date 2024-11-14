import { 接口测试 } from '@lsby/net-core'
import assert from 'assert'
import { clearDB } from '../../../../script/db/clear-db'
import { Global } from '../../../global/global'
import { 请求用例 } from '../../../tools/request'
import 接口描述 from './type'

var id = '1'
var data = 'abc'
export default new 接口测试(
  async (): Promise<void> => {
    var db = (await Global.getItem('kysely')).获得句柄()
    await clearDB(db)
  },

  async (): Promise<object> => {
    return 请求用例(接口描述, { callPwd: '123456', id: id, data: data })
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

    var kysely = (await Global.getItem('kysely')).获得句柄()
    var 数据库结果 = await kysely.selectFrom('data').select('data').where('id', '=', id).executeTakeFirst()

    assert.equal(数据库结果?.data, data)
  },
)