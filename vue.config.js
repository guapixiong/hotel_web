const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '127.0.0.1',
    port: 8084,
    open: false,// vue项目启动时自动打开浏览器
    proxy: {
      '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
        target: "http://127.0.0.1:8081", //目标地址，一般是指后台服务器地址
        changeOrigin: true, //是否跨域
        pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
          '^/api': ""
        }
      },
      '/images':{
        target: "http://127.0.0.1:8081",
        changeOrigin: true, //是否跨域
      }

    }
  },
  transpileDependencies: true,
  pages:{
    //主页面
    index:{
      entry: './src/main.js',
      template: './public/index.html',
      title: '用户登录'
    },
    admin:{
      entry:'./src/pages/admin/admin.js',
      template:'./public/admin.html',
      title: '管理员界面'
    },
  }
})
