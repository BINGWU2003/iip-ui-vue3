/**
 * 基础对象类型，用作泛型约束和默认值
 * @description 简化 `T extends Record<string, any> = Record<string, any>` 的写法
 * @example
 * ```ts
 * // 之前
 * type Foo<T extends Record<string, any> = Record<string, any>> = { data: T }
 * // 之后
 * type Foo<T extends BaseRecord = BaseRecord> = { data: T }
 * ```
 */
export type BaseRecord = Record<string, any>

/**
 * 通过给现有对象类型 T 的每个键添加指定前缀，来创建一个新的对象类型。
 * @template T - 原始的对象类型。
 * @template P - 要添加到每个键前面的字符串前缀。
 */
export type Prefixed<T extends object, P extends string> = {
  [K in keyof T & string as `${P}-${K}`]: T[K]
}
