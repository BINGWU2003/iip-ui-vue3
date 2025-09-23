/**
 * 通过给现有对象类型 T 的每个键添加指定前缀，来创建一个新的对象类型。
 * @template T - 原始的对象类型。
 * @template P - 要添加到每个键前面的字符串前缀。
 */
export type Prefixed<T extends object, P extends string> = {
  [K in keyof T & string as `${P}-${K}`]: T[K]
}
