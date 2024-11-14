import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'
import { Kysely } from 'kysely'
import { Global } from '../../global/global'
import { DB } from '../../types/db'

type 输入 = {
  kysely: Kysely<DB>
  callPwd: string
  id: string
  data: string
}
type 错误 = 'THE_CALL_PASSWORD_IS_INCORRECT'
type 输出 = {}

export class 存入数据 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var env = await (await Global.getItem('env')).获得环境变量()
    if (参数.callPwd != env.CALL_PWD) return new Left('THE_CALL_PASSWORD_IS_INCORRECT')

    var 存在检查 = await 参数.kysely.selectFrom('data').select(['id']).where('id', '=', 参数.id).executeTakeFirst()
    if (存在检查) {
      await 参数.kysely
        .updateTable('data')
        .set({
          data: 参数.data,
        })
        .where('id', '=', 参数.id)
        .execute()
    } else {
      await 参数.kysely
        .insertInto('data')
        .values({
          id: 参数.id,
          data: 参数.data,
        })
        .execute()
    }

    return new Right({})
  }
}
