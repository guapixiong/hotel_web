const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
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
    }
  }
})
