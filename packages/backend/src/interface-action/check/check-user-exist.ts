import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'
import { Insertable, Kysely } from 'kysely'
import { DB, user } from '../../types/db'

type 输入 = {
  kysely: Kysely<DB>
  用户名: string
}
type 错误 = '用户不存在'
type 输出 = {
  用户: Insertable<user>
}

export class 检查用户存在 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var user = await 参数.kysely
      .selectFrom('user')
      .select(['id', 'name', 'pwd'])
      .where('name', '=', 参数.用户名)
      .executeTakeFirst()
    if (user == null) return new Left('用户不存在')
    return new Right({ 用户: user })
  }
}
