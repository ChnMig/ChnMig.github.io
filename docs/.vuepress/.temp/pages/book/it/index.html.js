export const data = {
  "key": "v-4e147e37",
  "path": "/book/it/",
  "title": "",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "filePathRelative": "book/it/README.md",
  "git": {
    "updatedTime": 1628503661000,
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
