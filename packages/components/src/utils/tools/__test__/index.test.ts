import { describe, it, expect } from 'vitest'
import { splitSlots } from '../index'

describe('tools utils', () => {
  describe('splitSlots', () => {
    it('应该正确拆分插槽', () => {
      expect(
        splitSlots(
          {
            'foo-custom-bar': (name: string, age: number) => {
              return { name, age }
            },
            'foo-custom-baz': (height: string, weight: number) => {
              return { height, weight }
            }
          },
          'foo'
        )
      ).toEqual(['bar', 'baz'])
    })
  })
})
