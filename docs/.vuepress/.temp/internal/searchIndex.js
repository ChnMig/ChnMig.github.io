export const searchIndex = [
  {
    "title": "首页",
    "headers": [],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "关于我",
    "headers": [],
    "path": "/about.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "目录导览",
    "headers": [],
    "path": "/menu.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/book/it/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/book/fiction/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "目录",
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
    "path": "/book/rational/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "好的礼仪",
    "headers": [
      {
        "level": 2,
        "title": "前言",
        "slug": "前言",
        "children": []
      },
      {
        "level": 2,
        "title": "来源",
        "slug": "来源",
        "children": []
      },
      {
        "level": 2,
        "title": "什么是礼仪",
        "slug": "什么是礼仪",
        "children": []
      },
      {
        "level": 2,
        "title": "五感开关",
        "slug": "五感开关",
        "children": []
      },
      {
        "level": 2,
        "title": "文字语言",
        "slug": "文字语言",
        "children": []
      },
      {
        "level": 2,
        "title": "视觉语言",
        "slug": "视觉语言",
        "children": []
      },
      {
        "level": 2,
        "title": "微表情/微动作",
        "slug": "微表情-微动作",
        "children": [
          {
            "level": 3,
            "title": "眼睛",
            "slug": "眼睛",
            "children": []
          },
          {
            "level": 3,
            "title": "手",
            "slug": "手",
            "children": []
          },
          {
            "level": 3,
            "title": "握手",
            "slug": "握手",
            "children": []
          },
          {
            "level": 3,
            "title": "正确坐姿",
            "slug": "正确坐姿",
            "children": []
          },
          {
            "level": 3,
            "title": "餐桌座次",
            "slug": "餐桌座次",
            "children": []
          },
          {
            "level": 3,
            "title": "站姿男",
            "slug": "站姿男",
            "children": []
          },
          {
            "level": 3,
            "title": "招手",
            "slug": "招手",
            "children": []
          }
        ]
      },
      {
        "level": 2,
        "title": "仪容(男)",
        "slug": "仪容-男",
        "children": []
      }
    ],
    "path": "/book/rational/good_etiquette.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "目录",
    "headers": [
      {
        "level": 2,
        "title": "什么是Golang",
        "slug": "什么是golang",
        "children": []
      },
      {
        "level": 2,
        "title": "目录",
        "slug": "目录-1",
        "children": [
          {
            "level": 3,
            "title": "交叉编译",
            "slug": "交叉编译",
            "children": []
          }
        ]
      }
    ],
    "path": "/technology/golang/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "交叉编译",
    "headers": [
      {
        "level": 2,
        "title": "前言",
        "slug": "前言",
        "children": []
      },
      {
        "level": 2,
        "title": "正文",
        "slug": "正文",
        "children": []
      }
    ],
    "path": "/technology/golang/cross_compilation.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "目录",
    "headers": [
      {
        "level": 2,
        "title": "什么是Other",
        "slug": "什么是other",
        "children": []
      },
      {
        "level": 2,
        "title": "目录",
        "slug": "目录-1",
        "children": [
          {
            "level": 3,
            "title": "交叉编译",
            "slug": "交叉编译",
            "children": []
          }
        ]
      }
    ],
    "path": "/technology/other/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "个人常用的gitignore文件模板",
    "headers": [
      {
        "level": 2,
        "title": "作用",
        "slug": "作用",
        "children": []
      },
      {
        "level": 2,
        "title": "文件名",
        "slug": "文件名",
        "children": []
      },
      {
        "level": 2,
        "title": "Python",
        "slug": "python",
        "children": []
      },
      {
        "level": 2,
        "title": "Go",
        "slug": "go",
        "children": []
      }
    ],
    "path": "/technology/other/commonly_used_gitignore.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}
