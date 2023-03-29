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
    },
    staff:{
      entry:'./src/pages/staff/staff.js',
      template:'./public/staff.html',
      title: '员工界面'
    },
    user:{
      entry:'./src/pages/user/user.js',
      template:'./public/user.html',
      title: '员工界面'
    }
  }
})
