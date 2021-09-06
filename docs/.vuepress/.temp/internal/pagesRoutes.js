import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","首页",["/index.html","/README.md"]],
  ["v-22a39d25","/about.html","关于我",["/about","/about.md"]],
  ["v-be87f7fe","/menu.html","目录导览",["/menu","/menu.md"]],
  ["v-4e147e37","/book/it/","",["/book/it/index.html","/book/it/README.md"]],
  ["v-bea66cb0","/book/fiction/","",["/book/fiction/index.html","/book/fiction/README.md"]],
  ["v-cc1e6f58","/book/rational/","目录",["/book/rational/index.html","/book/rational/README.md"]],
  ["v-eda22e2e","/book/rational/good_etiquette.html","好的礼仪",["/book/rational/good_etiquette","/book/rational/good_etiquette.md"]],
  ["v-0215eccf","/technology/golang/","目录",["/technology/golang/index.html","/technology/golang/README.md"]],
  ["v-33ed8ea4","/technology/golang/cross_compilation.html","交叉编译",["/technology/golang/cross_compilation","/technology/golang/cross_compilation.md"]],
  ["v-711577a9","/technology/other/","目录",["/technology/other/index.html","/technology/other/README.md"]],
  ["v-13aafa19","/technology/other/commonly_used_gitignore.html","个人常用的gitignore文件模板",["/technology/other/commonly_used_gitignore","/technology/other/commonly_used_gitignore.md"]],
  ["v-3706649a","/404.html","",["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, title, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta: { title },
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
