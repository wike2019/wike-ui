#### on-ready

编辑器初始化完成时触发，返回值为Object，包含编辑器实例vm和insertContent,insertImage方法。

#### on-save

编辑器保存事件，自动保存或者手动保存时触发，支持`ctrl+s`或`command+s`触发保存，返回值类型为`Object`，为md编辑器的内容和为md内容解析成的html。


#### on-upload-image

监听编辑器粘贴图片事件，在编辑区域内手动粘贴图片时触发，可用于支持粘贴插入图片文件，返回`file`文件，上传文件后可结合`on-ready`事件内返回的`insertImage`插入图片。