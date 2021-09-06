export const data = {
  "key": "v-be87f7fe",
  "path": "/menu.html",
  "title": "目录导览",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "filePathRelative": "menu.md",
  "git": {
    "updatedTime": 1628519317000,
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
