import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'

type 输入 = {
  userId?: string | undefined
}
type 错误 = '未登录'
type 输出 = {
  userId: string
}

export class 检查登录 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var userId = 参数.userId
    if (userId == null) return new Left('未登录')
    return new Right({ userId: userId })
  }
}
