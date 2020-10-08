import WIcon from  "../../../../Icon/index"

export default  function  renderJsx(preview,fullscreen,scrolling,split,exportFileName,action) {

  let data=[
    {
      "tip":"撤销",
      "name":"fa-undo",
      "action":action.undo
    },
    {
      "tip":"重做",
      "name":"fa-repeat",
      "action":action.redo
    },
    {
      "tip":"粗体",
      "name":"fa-bold",
      "action":action.insertStrong
    },
    {
      "tip":"斜体",
      "name":"fa-italic",
      "action":action.insertItalic
    },
    {
      "tip":"删除线",
      "name":"fa-strikethrough",
      "action":action.insertOverline
    },   {
      "tip":"下划线",
      "name":"fa-underline",
      "action":action.insertUnderline
    }
  ];
  let title=[
    {
      "tip":"标题1",
      "name":"h1",
      "action":()=>{action.insertTitle(1)}
    },
    {
      "tip":"标题2",
      "name":"h2",
      "action":()=>{action.insertTitle(2)}
    },
    {
      "tip":"标题3",
      "name":"h3",
      "action":()=>{action.insertTitle(3)}
    },
    {
      "tip":"标题4",
      "name":"h4",
      "action":()=>{action.insertTitle(4)}
    },
    {
      "tip":"标题5",
      "name":"h5",
      "action":()=>{action.insertTitle(5)}
    },
    {
      "tip":"标题6",
      "name":"h6",
      "action":()=>{action.insertTitle(6)}
    }
  ]
  let other=[
    {
      "tip":"分割线",
      "name":"fa-minus",
      "action":action.undo
    },
    {
      "tip":"引用",
      "name":"fa-quote-left",
      "action":action.redo
    },
    {
      "tip":"无序列表",
      "name":"fa-list-ul",
      "action":action.undo
    },
    {
      "tip":"有序列表",
      "name":"fa-list-ol",
      "action":action.undo
    },
    {
      "tip":"代码块",
      "name":"fa-code",
      "action":action.undo
    },
    {
      "tip":"未完成列表",
      "name":"fa-square-o",
      "action":action.undo
    },
    {
      "tip":"已完成列表",
      "name":"fa-check-square-o",
      "action":action.undo
    },
    {
      "tip":"链接",
      "name":"fa-link",
      "action":action.undo
    },
    {
      "tip":"图片",
      "name":"fa-picture-o",
      "action":action.undo
    },
    {
      "tip":"本地图片",
      "name":"fa-file-image-o",
      "action":action.undo
    },
    {
      "tip":"表格",
      "name":"fa-table",
      "action":action.undo
    },
    {
      "tip":"导入MD文件",
      "name":"fa-file-text-o",
      "action":action.undo
    },
    {
      "tip":"导入word",
      "name":"fa-file-word-o",
      "action":action.undo
    },
    {
      "tip":"解析sql",
      "name":"fa-database",
      "action":action.undo
    },
    {
      "tip":"解析html",
      "name":"fa-html5",
      "action":action.undo
    },
    {
      "tip":"全屏编辑",
      "name":"fa-television",
      "action":action.undo
    },
    {
      "tip":"分屏显示",
      "name":"fa-columns",
      "action":action.undo
    },
    {
      "tip":"预览",
      "name":"fa-eye",
      "action":action.undo
    },
    {
      "tip":"清空",
      "name":"fa-eraser",
      "action":action.undo
    },
    {
      "tip":"保存",
      "name":"fa-floppy-o",
      "action":action.undo
    },
  ];
  return !preview?"": (<ul class="markdown-toolbars">
        <li class="tools_title">WK编辑器</li>
        {renderList(data)}
        {renderTitle(title)}
        {renderList(other)}
        {renderScrolling(scrolling)}
        {renderDownload()}
        <li class="empty"></li>
        {renderFullscreen(fullscreen)}
      </ul>)

}
function renderList(data) {
  return data.map((item)=>{
    // @ts-ignore
    return ( <li  name={item.tip} >
      <WIcon  name={item.name}  class="iconfont" onClick={item.action}></WIcon>
    </li>)
  })
}
function renderTitle(data) {
  return data.map((item)=>{
    // @ts-ignore
    return ( <li  name={item.tip} >
      <span style="font-size: 16px;" onClick={item.action}>{item.name}</span>
    </li>)
  })
}
function  renderScrolling(scrolling) {
  // @ts-ignore
  return (<li name={scrolling ? "同步滚动:开" : "同步滚动:关"}>
      {scrolling?  <WIcon name="fa-toggle-on" class="iconfont" ></WIcon>: <WIcon name="fa-toggle-off" class="iconfont"></WIcon>}
    </li>)
}
function  renderFullscreen(fullscreen) {
  // @ts-ignore
  return (fullscreen? <li  name="退出全屏"><WIcon name="fa-window-close-o" class="iconfont"></WIcon></li>: <li  name="全屏"><WIcon name="fa-arrows-alt" class="iconfont"></WIcon></li>
  )
}
function  renderDownload() {
  return <li   class="download">
    <WIcon name="fa-download" class="iconfont"></WIcon>
    <ul class="hover_show">
      <li >
        <WIcon name="fa-file-o" class="iconfont" style="display:inline;margin-right:10px"></WIcon>
        导出 Markdown
      </li>
      <li>
        <WIcon name="fa-file-pdf-o" class="iconfont" style="display:inline;margin-right:10px"></WIcon>
        导出 pdf
      </li>
    </ul>
  </li>
}
