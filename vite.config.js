import path from 'path'
module.exports = {
    // 导入别名
    alias: {
        '/@/': path.resolve(__dirname, './src'),
    },
    // 配置Dep优化行为
    optimizeDeps: {
        include: ["codemirror",'marked']
    },
    // 为开发服务器配置自定义代理规则。

}