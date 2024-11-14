import { 业务行为 } from '@lsby/net-core'
import { Either, Left, Right } from '@lsby/ts-fp-data'
import { user } from '../../types/db'

type 输入 = {
  用户: user
  输入密码: string
}
type 错误 = '密码错误'
type 输出 = {}

export class 检查用户密码 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    if (参数.用户.pwd == 参数.输入密码) return new Right({})
    return new Left('密码错误')
  }
}
