import { JSON状态接口类型 } from '@lsby/net-core'
import { 文件上传插件 } from '@lsby/net-core-file-upload'
import { Task } from '@lsby/ts-fp-data'
import { z } from 'zod'
import { Global } from '../../../global/global'

export default new JSON状态接口类型(
  '/api/base/upload-file',
  'post',
  [
    new Task(async () => {
      var jwt = await Global.getItem('jwt-plugin')
      return jwt.解析器
    }),
    new Task(async () => {
      var env = await (await Global.getItem('env')).获得环境变量()
      return new 文件上传插件({ 文件最大大小: env.UPLOAD_MAX_FILE_SIZE * 1024 * 1024 })
    }),
  ],
  z.object({}),
  z.enum(['未登录']),
)
