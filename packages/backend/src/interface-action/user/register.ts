import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'
import { randomUUID } from 'crypto'
import { Kysely } from 'kysely'
import { DB } from '../../types/db'
import { 查找用户 } from './find-user'

type 输入 = {
  kysely: Kysely<DB>
  name: string
  pwd: string
}
type 错误 = '用户名已存在'
type 输出 = {}

export class 注册 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var 用户存在 = (await new 查找用户().运行业务行为({ kysely: 参数.kysely, 用户名: 参数.name }))
      .assertRight()
      .getRight()
    if (用户存在.用户) return new Left('用户名已存在')
    await 参数.kysely.insertInto('user').values({ id: randomUUID(), name: 参数.name, pwd: 参数.pwd }).execute()
    return new Right({})
  }
}
