export const siteData = {
  "base": "/",
  "lang": "zh-CN",
  "title": "ChnMig的个人网站",
  "description": "知识,实践,灵感和机遇",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/images/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "theme-color",
        "content": "#3eaf7c"
      }
    ]
  ],
  "locales": {}
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
