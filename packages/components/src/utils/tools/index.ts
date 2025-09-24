import type { Prefixed } from '../types'
export const splitSlots = (slots: Prefixed<object, string>, prefix: string) => {
  return Object.keys(slots || {})
    .filter(key => key.startsWith(prefix + '-'))
    .map(key => key.split('-')[1])
}
