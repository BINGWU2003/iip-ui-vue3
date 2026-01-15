# @bingwu/iip-ui-components

## 1.2.33

### Patch Changes

- dialog-select组件优化，打包配置优化

## 1.2.32

### Patch Changes

- 在dialog-select组件中新增showSelectionPanel和selectedLabelFormatter属性，支持实时显示已选项、单个删除和清空操作。
- 更新参数表，添加 showSelectionPanel 和 selectedLabelFormatter 属性的说明。
- 优化示例代码，展示如何使用新功能。
- 在 dialog-select 组件中新增 beforeClose 回调函数，允许用户在对话框关闭前执行自定义逻辑，如验证数据、显示确认提示或阻止关闭。
- 更新文档，提供 beforeClose 的参数说明和多个使用示例，展示如何在确认和取消操作中使用该回调。
- 在相关组件中实现 beforeClose 功能，确保用户可以根据选择的行数据进行相应的处理。
- Updated dependencies
  - @bingwu/iip-ui-utils@1.2.15

## 1.2.31

### Patch Changes

- 在 dialog-select 组件中新增 scrollToTopLeft 属性，允许用户在数据加载后自动滚动到顶部和左部，默认为 false。

## 1.2.30

### Patch Changes

- style: 移除 dialog-select 组件的宽度样式，简化样式定义

## 1.2.29

### Patch Changes

- refactor: 优化 dialog-select 组件的列配置逻辑

## 1.2.28

### Patch Changes

- 去除dialog-select只读模式

## 1.2.27

### Patch Changes

- dialog-select优化，默认append-to-body。openDialogSelect的类型推导完善

## 1.2.26

### Patch Changes

- 新增dropdown-list组件，重构dialog-select的类型

## 1.2.25

### Patch Changes

- vxe版号锁定

## 1.2.24

### Patch Changes

- vxe打包配置

## 1.2.23

### Patch Changes

- 修复openDialogSelect函数导出问题，修复openDialogSelect组件gridConfig报错问题

## 1.2.22

### Patch Changes

- 新增openDialogSelect 函数式调用和pagination-select多选功能

## 1.2.21

### Patch Changes

- 新增类型导出

## 1.2.20

### Patch Changes

- 新增弹窗下拉组件

## 1.2.19

### Patch Changes

- 优化分页组件，删除无用函数和组件
- Updated dependencies
  - @bingwu/iip-ui-utils@1.2.14

## 1.2.18

### Patch Changes

- 中文化支持

## 1.2.17

### Patch Changes

- test
- Updated dependencies
  - @bingwu/iip-ui-utils@1.2.13

## 1.2.16

### Patch Changes

- 构建工具升级
- Updated dependencies
  - @bingwu/iip-ui-utils@1.2.12

## 1.2.15

### Patch Changes

- 优化发包
- Updated dependencies
  - @bingwu/iip-ui-utils@1.2.11
