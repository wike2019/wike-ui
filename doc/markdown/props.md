## 编辑器基本属性
#### value
- Type: `String/Number`
- Default: `''`

编辑器输入的文本，支持通过`v-model`数据双向绑定设置编辑器内容和获取编辑器的值。

#### width
- Type: `String/Number`
- Default: `auto`

编辑器的初始化宽度。

#### height
- Type: `Number`
- Default: `600`

编辑器的初始化高度。

#### autoSave

- Type: `Boolean`
- Default: `false`

是否开启自动保存，设置为开启时可通过绑定`on-save`事件获取编辑器内的文本内容和渲染过后的html字符串。

```vue
<wike_md @on-save="onSave"/>
```

interval

- Type: `Number`
- Default: `10000`

自动保存间隔时间，单位：`mm`，默认10000mm，需要`autoSave = true`时才有效。



#### isPreview
- Type: `Boolean`
- Default: `false`

是否是预览模式，开启时可作为一个预览组件使用，与预览组件功能一致。



