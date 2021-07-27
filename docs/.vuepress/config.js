// https://v2.vuepress.vuejs.org/zh/reference/config.html
module.exports = {
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
        text: '博客分类',
        children: [
          {
            text: '技术',
            children: [
              {
                text: 'Golang',
                link: '/blog/technology/golang/'
              },
              {
                text: 'Rust',
                link: '/blog/technology/rust/'
              },
              {
                text: 'Python',
                link: '/blog/technology/python/'
              },
              {
                text: 'Linux',
                link: '/blog/technology/linux/'
              },
              {
                text: '其他',
                link: '/blog/technology/other/'
              }
            ]
          },
          {
            text: '读书',
            children: [
              {
                text: '计算机',
                link: '/blog/book/it/'
              },
              {
                text: '情感',
                link: '/blog/book/emotion/'
              },
              {
                text: '小说',
                link: '/blog/book/fiction/'
              },
            ]
          },
          {
            text: '生活',
            children: [
              {
                text: '菜谱',
                link: '/blog/life/recipe/'
              },
              {
                text: '其他',
                link: '/blog/life/other/'
              }
            ]
          }
        ]
      },
      {
        text: '数据统计',
        link: 'https://analytics.google.com/analytics/web'
      },
      {
        text: '关于我',
        link: '/about/'
      }
    ],
  },

  lang: 'zh-CN',
  title: 'ChnMig的个人网站',
  description: '知识,汗水,灵感和机遇',
  base: '/',
  head: [['link', { rel: 'icon', href: '/images/favicon.ico' }]],

  plugins: [
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-L57VYPMS8J',
      },
    ],
  ],
}
