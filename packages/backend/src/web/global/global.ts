import { GlobalItem, GlobalService } from '@lsby/ts-global'
import { Log } from '@lsby/ts-log'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Get请求后端函数类型,
  Post接口路径们,
  Post请求后端函数类型,
  从路径获得参数,
  从路径获得正确返回,
  从路径获得泛化的错误返回,
  元组转联合,
} from '../../types/interface-type'

export class 后端客户端 {
  private token: string | undefined

  post: Post请求后端函数类型 = async (路径, 参数) => {
    const c = await axios.post(路径, 参数, { headers: { authorization: this.token } })
    if (c.status >= 500) {
      const log = new Log('web')
      await log.err('服务器错误: %o', c)
      throw new Error('服务器错误')
    }
    return c.data
  }
  get: Get请求后端函数类型 = async (路径, 参数) => {
    const c = await axios.get(路径, { ...参数, headers: { authorization: this.token } })
    if (c.status >= 500) {
      const log = new Log('web')
      await log.err('服务器错误: %o', c)
      throw new Error('服务器错误')
    }
    return c.data
  }

  async 初始化(): Promise<this> {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      this.token = storedToken
    }
    var c = await this.post('/api/user/is-login', {})
    if (!c.data.isLogin) {
      localStorage.removeItem('token')
      this.token = undefined
    }
    return this
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async 登录(用户名: string, 密码: string) {
    const c = await this.post('/api/user/login', { name: 用户名, pwd: 密码 })
    if (c.status !== 'fail') {
      this.token = c.data.token
      localStorage.setItem('token', this.token)
    }
    return c
  }
  async 退出登录(): Promise<void> {
    localStorage.removeItem('token')
    this.token = undefined
  }

  已登录(): boolean {
    return !!this.token
  }
}

export var GlobalWeb = new GlobalService([
  new GlobalItem('后端客户端', new 后端客户端()),
  new GlobalItem('log', new Log('web')),
])

export function usePost<
  路径 extends 元组转联合<Post接口路径们>,
  正确类型 extends 从路径获得正确返回<路径>,
  错误类型 extends 从路径获得泛化的错误返回<路径>,
>(
  路径: 路径,
  参数: 从路径获得参数<路径>,
  最大重试次数: number = 5,
  重试延时: number = 1000,
): [
  正确类型 | 错误类型 | undefined,
  () => void,
  (正确结果: 正确类型['data']) => void,
  (错误结果: 错误类型['data']) => void,
] {
  const [返回数据, 设置数据] = useState<正确类型 | 错误类型>()
  var [刷新标志, 设置刷新标志] = useState(false)
  var 参数文本 = JSON.stringify(参数)

  useEffect(() => {
    if (刷新标志) {
      设置刷新标志(false)
    }

    var 已请求 = false
    var 当前重试次数 = 0

    const 请求数据 = (): void => {
      GlobalWeb.getItem('后端客户端')
        .then((客户端) => {
          客户端
            .post(路径, JSON.parse(参数文本))
            .then((结果) => {
              if (已请求) return
              设置数据(结果 as 正确类型)
            })
            .catch((e) => {
              if (当前重试次数 < 最大重试次数) {
                setTimeout(() => {
                  当前重试次数++
                  请求数据()
                }, 重试延时)
              } else {
                var 错误: 错误类型 = { status: 'fail', data: String(e) } as 错误类型
                if (已请求) return
                设置数据(错误)
              }
            })
        })
        .catch((e) => {
          GlobalWeb.getItem('log')
            .then((log) => log.err(e))
            .catch(console.error)
        })
    }

    请求数据()

    return (): void => {
      已请求 = true
    }
  }, [路径, 参数文本, 最大重试次数, 重试延时, 设置数据, 刷新标志])

  return [
    返回数据,
    (): void => {
      设置刷新标志(true)
    },
    (正确结果: 正确类型['data']): void => {
      设置数据({ status: 'success', data: 正确结果 } as unknown as 正确类型)
    },
    (错误结果: 错误类型['data']): void => {
      设置数据({ status: 'fail', data: 错误结果 } as 错误类型)
    },
  ]
}
