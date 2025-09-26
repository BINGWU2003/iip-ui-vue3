import type { Prefixed } from '../types'
/**
 * 拆分插槽 用于二次封装组件时，获取不同字段的插槽
 * 注意：如果该组件本身原有的插槽包含分隔符 - ,则该方法不适合使用
 * 例如: 组件el-image 的插槽名称包含 - ,比如为viewer-error 等,因为该方法会拆分出 viewer 和 error 两个插槽
 * 组件文档:https://element-plus.org/zh-CN/component/image#image-viewer-slots
 * @param slots 插槽对象
 * @param prefix 前缀
 * @returns 拆分后的插槽
 */
export const splitSlots = (slots: Prefixed<object, string>, prefix: string) => {
  return Object.keys(slots || {})
    .filter(key => key.startsWith(prefix + '-'))
    .map(key => key.split('-').pop())
}
