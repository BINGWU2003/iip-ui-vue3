<template>
  <div class="iip-dropdown-list">
    <el-dropdown ref="dropdownRef" v-bind="props.dropdownProps">
      <template v-for="(_, key) in slots" :key="key" #[key]="slotData">
        <slot :name="key" v-bind="slotData"></slot>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in getDropdownList"
            :key="index"
            v-bind="getDropdownItemProps(item)"
          >
            {{ getDropdownItemContent(item) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import type {
  DropdownListProps,
  DropdownListItemType,
  DropdownListSlots,
  DropdownListInstance
} from './type'

defineOptions({
  name: 'iip-dropdown-list'
})
defineSlots<DropdownListSlots>()
const props = withDefaults(defineProps<DropdownListProps>(), {
  dropdownList: () => [],
  dropdownProps: () => ({})
})
const slots = useSlots()
const dropdownRef = ref<DropdownListInstance>()
const getDropdownList = computed(() => {
  return props.dropdownList.filter(item => {
    // show 未定义时默认显示
    if (item.show === undefined) return true
    return !!item.show
  })
})
const getDropdownItemProps = (item: DropdownListItemType) => {
  const { content: _content, show: _show, ...rest } = item
  return rest
}
const getDropdownItemContent = (item: DropdownListItemType) => {
  return item.content || ''
}
defineExpose(
  new Proxy(
    {},
    {
      get(_, key) {
        return dropdownRef.value?.[key]
      },
      has(_, key) {
        return key in (dropdownRef.value ?? {})
      }
    }
  )
)
</script>
