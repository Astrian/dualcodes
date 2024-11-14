import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'
import { Kysely } from 'kysely'
import { Global } from '../../global/global'
import { DB } from '../../types/db'

type 输入 = {
  kysely: Kysely<DB>
  callPwd: string
  id: string
}
type 错误 = 'THE_CALL_PASSWORD_IS_INCORRECT' | 'DATA_DOES_NOT_EXIST'
type 输出 = {
  data: string
  createdAt: string
  updatedAt: string
}

export class 读取数据 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var env = await (await Global.getItem('env')).获得环境变量()
    if (参数.callPwd != env.CALL_PWD) return new Left('THE_CALL_PASSWORD_IS_INCORRECT')

    var 结果 = await 参数.kysely
      .selectFrom('data')
      .select(['data', 'created_at as createdAt', 'data.updated_at as updatedAt'])
      .where('id', '=', 参数.id)
      .executeTakeFirst()
    if (!结果) return new Left('DATA_DOES_NOT_EXIST')

    return new Right(结果)
  }
}
