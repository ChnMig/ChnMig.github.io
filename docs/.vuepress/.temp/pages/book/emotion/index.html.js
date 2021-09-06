export const data = {
  "key": "v-20deb141",
  "path": "/book/emotion/",
  "title": "目录",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "为什么写",
      "slug": "为什么写",
      "children": []
    },
    {
      "level": 2,
      "title": "目录",
      "slug": "目录-1",
      "children": [
        {
          "level": 3,
          "title": "好的礼仪",
          "slug": "好的礼仪",
          "children": []
        }
      ]
    }
  ],
  "filePathRelative": "book/emotion/README.md",
  "git": {
    "updatedTime": 1628432209000,
    "contributors": [
      {
        "name": "ChnMig",
        "email": "chnmig@outlook.com",
        "commits": 1
      }
    ]
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
