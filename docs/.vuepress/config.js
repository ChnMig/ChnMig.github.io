// https://v2.vuepress.vuejs.org/zh/reference/config.html
module.exports = {
  lang: 'zh-CN',
  title: 'ChnMig的博客',
  description: '',
  base: '/',
  head: [['link', { rel: 'icon', href: '/images/favicon.ico' }]],

  themeConfig: {
    logo: '/images/avatar.gif',
    repo: 'https://github.com/ChnMig',
    navbar: [
      {
        text: '访问数据',
        link: 'https://tongji.baidu.com/web/10000012572/overview/index'
      },
      {
        text: '关于我',
        linl: '/about'
      }
    ],
  },
}
