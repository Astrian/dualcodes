export type InterfaceType = [{ path: "/api/base/add"; method: "post"; input: { a: number; b: number; }; successOutput: { status: "success"; data: { res: number; }; }; errorOutput: { status: "fail"; data: never; }; },{ path: "/api/base/sub"; method: "post"; input: { a: number; b: number; }; successOutput: { status: "success"; data: { res: number; }; }; errorOutput: { status: "fail"; data: "未登录"; }; },{ path: "/api/base/upload-file"; method: "post"; input: {}; successOutput: { status: "success"; data: {}; }; errorOutput: { status: "fail"; data: "未登录"; }; },{ path: "/api/user/is-login"; method: "post"; input: {}; successOutput: { status: "success"; data: { isLogin: boolean; }; }; errorOutput: { status: "fail"; data: never; }; },{ path: "/api/user/login"; method: "post"; input: { name: string; pwd: string; }; successOutput: { status: "success"; data: { token: string; }; }; errorOutput: { status: "fail"; data: "用户不存在" | "密码错误"; }; },{ path: "/api/user/register"; method: "post"; input: { name: string; pwd: string; }; successOutput: { status: "success"; data: {}; }; errorOutput: { status: "fail"; data: "用户名已存在"; }; },{ path: "/api/dualcodes/load"; method: "post"; input: { callPwd: string; id: string; }; successOutput: { status: "success"; data: { data: string; createdAt: string; updatedAt: string; }; }; errorOutput: { status: "fail"; data: "THE_CALL_PASSWORD_IS_INCORRECT" | "DATA_DOES_NOT_EXIST"; }; },{ path: "/api/dualcodes/save"; method: "post"; input: { data: string; callPwd: string; id: string; }; successOutput: { status: "success"; data: {}; }; errorOutput: { status: "fail"; data: "THE_CALL_PASSWORD_IS_INCORRECT"; }; }]

export type 元组转联合<T> = T extends any[] ? T[number] : never

export type 所有接口路径们<A = InterfaceType> = A extends []
  ? []
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? [x['path'], ...所有接口路径们<xs>]
      : never
    : never
type Get接口路径们<A = InterfaceType> = A extends []
  ? []
  : A extends [infer x, ...infer xs]
    ? 'method' extends keyof x
      ? x['method'] extends 'get'
        ? 'path' extends keyof x
          ? [x['path'], ...Get接口路径们<xs>]
          : never
        : never
      : never
    : never
export type Post接口路径们<A = InterfaceType> = A extends []
  ? []
  : A extends [infer x, ...infer xs]
    ? 'method' extends keyof x
      ? x['method'] extends 'post'
        ? 'path' extends keyof x
          ? [x['path'], ...Post接口路径们<xs>]
          : never
        : never
      : never
    : never

export type 从路径获得参数<Path, A = InterfaceType> = A extends []
  ? never
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? x['path'] extends Path
        ? 'input' extends keyof x
          ? x['input']
          : never
        : 从路径获得参数<Path, xs>
      : never
    : never
export type 从路径获得方法<Path, A = InterfaceType> = A extends []
  ? never
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? x['path'] extends Path
        ? 'method' extends keyof x
          ? x['method']
          : never
        : 从路径获得方法<Path, xs>
      : never
    : never
export type 从路径获得正确返回<Path, A = InterfaceType> = A extends []
  ? never
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? x['path'] extends Path
        ? 'successOutput' extends keyof x
          ? x['successOutput']
          : never
        : 从路径获得正确返回<Path, xs>
      : never
    : never
export type 从路径获得错误返回<Path, A = InterfaceType> = A extends []
  ? never
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? x['path'] extends Path
        ? 'errorOutput' extends keyof x
          ? x['errorOutput']
          : never
        : 从路径获得错误返回<Path, xs>
      : never
    : never
export type 从路径获得泛化的错误返回<Path, A = InterfaceType> = A extends []
  ? never
  : A extends [infer x, ...infer xs]
    ? 'path' extends keyof x
      ? x['path'] extends Path
        ? 'errorOutput' extends keyof x
          ? 'data' extends keyof x['errorOutput']
            ? { status: 'fail'; data: x['errorOutput']['data'] | string }
            : never
          : never
        : 从路径获得错误返回<Path, xs>
      : never
    : never

export type 请求后端函数类型 = <路径 extends 元组转联合<所有接口路径们>>(
  路径: 路径,
  参数: 从路径获得参数<路径>,
  方法: 从路径获得方法<路径>,
) => Promise<从路径获得正确返回<路径> | 从路径获得错误返回<路径>>
export type Get请求后端函数类型 = <路径 extends 元组转联合<Get接口路径们>>(
  路径: 路径,
  参数: 从路径获得参数<路径>,
) => Promise<从路径获得正确返回<路径> | 从路径获得错误返回<路径>>
export type Post请求后端函数类型 = <路径 extends 元组转联合<Post接口路径们>>(
  路径: 路径,
  参数: 从路径获得参数<路径>,
) => Promise<从路径获得正确返回<路径> | 从路径获得错误返回<路径>>
