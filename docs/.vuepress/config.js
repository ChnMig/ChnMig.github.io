// https://v2.vuepress.vuejs.org/zh/reference/config.html
module.exports = {
    lang: 'zh-CN',
    title: 'ChnMig的个人网站',
    description: '知识,实践,灵感和机遇',
    base: '/',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ],
    themeConfig: {
        navbar: [
            {
                text: '技术',
                children: [
                    {
                        text: 'Golang',
                        link: '/technology/golang/',
                    },
                    {
                        text: 'Rust',
                        link: '/technology/rust/',
                    },
                    {
                        text: 'Python',
                        link: '/technology/python/',
                    },
                    {
                        text: 'Linux',
                        link: '/technology/linux/',
                    },
                    {
                        text: '其他',
                        link: '/technology/other/',
                    },
                ],
            },
            {
                text: '读书',
                children: [
                    {
                        text: '计算机',
                        link: '/book/it/',
                    },
                    {
                        text: '理性',
                        link: '/book/emotion/',
                    },
                    {
                        text: '小说',
                        link: '/book/fiction/',
                    },
                ],
            },
            {
                text: '生活',
                children: [
                    {
                        text: '菜谱',
                        link: '/blog/life/recipe/',
                    },
                    {
                        text: '其他',
                        link: '/blog/life/other/',
                    },
                ],
            },
            {
                text: '关于',
                link: '/about',
            },
            {
                text: '数据统计',
                link: 'https://analytics.google.com/analytics/web',
            },
        ],
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
    },
    plugins: [
        [
            '@vuepress/plugin-google-analytics',
            {
                id: 'G-L57VYPMS8J',
            },
        ],
        [
            '@vuepress/plugin-search',
            {
                locales: {
                    '/': {
                        placeholder: '搜索',
                    },
                },
            },
        ],
        [
            '@vuepress/plugin-shiki',
            {
                theme: 'dark-plus',
            },
        ],
    ]
}