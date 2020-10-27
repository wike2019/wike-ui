let data=[
    {
        "tip":"撤销",
        "name":"fa-undo",
         "action":"undo"
    },
    {
        "tip":"重做",
        "name":"fa-repeat",
        "action":"redo"
    },
    {
        "tip":"粗体",
        "name":"fa-bold",
        "action":"insertStrong"
    },
    {
        "tip":"斜体",
        "name":"fa-italic",
        "action":"insertItalic"
    },
    {
        "tip":"删除线",
        "name":"fa-strikethrough",
        "action":"insertOverline"

    },   {
        "tip":"下划线",
        "name":"fa-underline",
        "action":"insertUnderline"
    }
];
let title=[
    {
        "tip":"标题1",
        "name":"h1",
        "action":"insertTitle",
        "level":1
    },
    {
        "tip":"标题2",
        "name":"h2",
        "action":"insertTitle",
        "level":2
    },
    {
        "tip":"标题3",
        "name":"h3",
        "action":"insertTitle",
        "level":3
    },
    {
        "tip":"标题4",
        "name":"h4",
        "action":"insertTitle",
        "level":4
    },
    {
        "tip":"标题5",
        "name":"h5",
        "action":"insertTitle",
        "level":5
    },
    {
        "tip":"标题6",
        "name":"h6",
        "action":"insertTitle",
        "level":6
    }
]
let other=[
    {
        "tip":"分割线",
        "name":"fa-minus",
        "action":"insertLine"
    },
    {
        "tip":"引用",
        "name":"fa-quote-left",
        "action":"insertQuote"
    },
    {
        "tip":"无序列表",
        "name":"fa-list-ul",
        "action":"insertUl"
    },
    {
        "tip":"有序列表",
        "name":"fa-list-ol",
        "action":"insertOl"
    },

    {
        "tip":"未完成列表",
        "name":"fa-square-o",
        "action":"insertNotFinished"
    },
    {
        "tip":"已完成列表",
        "name":"fa-check-square-o",
        "action":"insertFinished"
    },

    {
        "tip":"图片",
        "name":"fa-picture-o",
        "action":"insertImage"
    },



    ];
let  alertdata=[
    {
        "tip":"表格",
        "name":"fa-table",
        "attr":"tableShow",
        "value":true
    },
    {
        "tip":"代码块",
        "name":"fa-code",
        "attr":"codeShow",
        "value":true
    },

    {
        "tip":"解析sql",
        "name":"fa-database",
        "attr":"sqlShow",
        "value":true
    },  {
        "tip":"链接",
        "name":"fa-link",
        "attr":"linkShow",
        "value":true
    },


]
let attr=[
    {
        "tip":"预览",
        "name":"fa-eye",
         "attr":"preview",
        "value":true
    },
    {
        "tip":"全屏编辑",
        "name":"fa-television",
        "attr":"split",
        "value":false
    },
    {
        "tip":"分屏显示",
        "name":"fa-columns",
        "attr":"split",
        "value":true
    }
]
export  {data,title,other,alertdata,attr}
