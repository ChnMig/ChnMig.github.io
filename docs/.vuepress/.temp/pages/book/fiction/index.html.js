export const data = {
  "key": "v-bea66cb0",
  "path": "/book/fiction/",
  "title": "",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "filePathRelative": "book/fiction/README.md",
  "git": {
    "updatedTime": 1628503661000,
    "contributors": [
      {
        "name": "ChnMig",
        "email": "chnmig@outlook.com",
        "commits": 3
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
