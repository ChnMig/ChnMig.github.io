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
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者',
    tip: '提示',
    warning: '注意',
    danger: '警告',
    backToHome: '返回首页',
    openInNewWindow: '在新窗口打开',
    toggleDarkMode: '切换夜间模式',
    notFound: [
      '这里什么都没有',
      '我们怎么到这来了？',
      '这是一个 404 页面',
      '看起来我们进入了错误的链接',
    ],
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
