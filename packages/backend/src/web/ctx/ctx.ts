import React from 'react'
import { GlobalWeb, 后端客户端 } from '../global/global'

export type 上下文类型 = {
  客户端: 后端客户端
}

export const 上下文描述 = React.createContext<上下文类型>({
  客户端: await (await GlobalWeb.getItem('后端客户端')).初始化(),
})
