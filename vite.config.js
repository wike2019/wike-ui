import path from 'path';
module.exports = {
    // 导入文件夹别名
    alias: {
        '/@/': path.resolve(__dirname, './src'),
        '/@views/': path.resolve(__dirname, './src/views'),
        '/@components/': path.resolve(__dirname, './src/components'),
        '/@core/': path.resolve(__dirname, './src/core'),
    },
    // 配置Dep优化行为
    optimizeDeps: {
        include: ['@ant-design-vue/use']
    },
}
