import { 业务行为 } from '@lsby/net-core'
import { Either, Right } from '@lsby/ts-fp-data'
import { Global } from '../../global/global'

type 输入 = {
  userId: string
  files: {
    name: string
    encoding: string
    mimetype: string
    data: Buffer
    tempFilePath: string
    truncated: boolean
    size: number
    md5: string
  }[]
}
type 错误 = never
type 输出 = {}

export class 上传文件 extends 业务行为<输入, 错误, 输出> {
  protected override async 业务行为实现(参数: 输入): Promise<Either<错误, 输出>> {
    var log = (await Global.getItem('log')).extend('upload-file')
    await log.debug('userId为%o的用户, 上传的文件信息: %j', 参数.userId, 参数.files)
    return new Right({})
  }
}
