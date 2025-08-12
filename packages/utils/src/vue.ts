import type { App, Component } from 'vue'

export type SFCWithInstall<T> = T & { install(app: App): void }

/**
 * 为组件添加 install 方法，使其可以通过 app.use() 安装
 */
export function withInstall<T extends Component>(component: T): SFCWithInstall<T> {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any).name || (component as any).__name
    if (name) {
      app.component(name, component)
    }
  }
  return component as SFCWithInstall<T>
}

/**
 * 为多个组件批量添加 install 方法
 */
export function withInstallFunction<T>(fn: T, name: string) {
  ;(fn as any).install = (app: App) => {
    app.config.globalProperties[name] = fn
  }
  return fn as T & { install(app: App): void }
}

/**
 * 创建命名空间
 */
export function createNamespace(name: string) {
  const prefixedName = `iip-${name}`
  return {
    n: (className?: string) => (className ? `${prefixedName}__${className}` : prefixedName),
    classes: (...classes: (string | undefined)[]) =>
      classes
        .filter(Boolean)
        .map(cls => `${prefixedName}__${cls}`)
        .join(' ')
  }
}
