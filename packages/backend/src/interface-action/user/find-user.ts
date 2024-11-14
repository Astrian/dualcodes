import { 业务行为 } from '@lsby/net-core'
import { Either, Right } from '@lsby/ts-fp-data'
import { Insertable, Kysely } from 'kysely'
import { DB, user } from '../../types/db'
import { 检查用户存在 } from '../check/check-user-exist'

type 输入 = {
  kysely: Kysely<DB>
  用户名: string
}
type 错误 = never
type 输出 = {
  用户: Insertable<user> | null
}

export class 查找用户 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var 结果 = await new 检查用户存在().运行业务行为(参数)
    if (结果.isLeft()) return new Right({ 用户: null })
    return new Right(结果.assertRight().getRight())
  }
}
