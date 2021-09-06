# vueProcess

## upgrade vue-process

[yarn docs](https://classic.yarnpkg.com/en/docs/cli/upgrade#toc-yarn-upgrade-package-latest-l-caret-tilde-exact-pattern)

``` shell
vim package.json

# update vueprocess

yarn install
```

## start

``` shell
yarn docs:dev
```

## start dev

``` shell
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y

curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt install nodejs

yarn install
yarn docs:dev
```

# hexo

[install nvm](https://github.com/nvm-sh/nvm)

[install npm && node](https://www.runoob.com/w3cnote/nvm-manager-node-versions.html)

``` bash
npm install -g hexo-cli
echo 'PATH="$PATH:./node_modules/.bin"' >> ~/.profile
npm install -g npm-check-updates
hexo init .
hexo install
npm install -S hexo-theme-icarus
npm install hexo-filter-github-emojis hexo-deployer-git bulma-stylus hexo-renderer-inferno --save
npm un hexo-renderer-marked --save
npm i hexo-renderer-markdown-it --save
ncu
ncu -u
npm install
# npm uninstall -g hexo-cli
npm list -g
```

[Icarus快速上手 - Icarus (ppoffice.github.io)](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/icarus快速上手/#install-npm)

``` bash
hexo config theme icarus
hexo server
# https://githubmemory.com/repo/ppoffice/hexo-theme-icarus/issues/855?page=3
npm install bulma-stylus hexo-renderer-inferno --save 
hexo server
```

## push

``` bash
git add .
git commit -m "message"
git push
hexo clean && hexo deploy
```

## markdownTemplate

### 配置

``` markdown
---
title: 文章标题              `文章标题`
date: 2020-01-01            `发布时间`
updated: 2020-01-01         `最后更新时间`
comments: true              `开启评论`
toc: true                   `开启目录`
excerpt: 这是一篇文章...      `文章列表展示的文章简介`
tags:                       `tag标签, 多个`
- tag1
- tag2
categories:                 `分类, 一个`
- categories1
cover: /images/logo.ico     `文章封面`
thumbnail: /image/logo.ico  `文章缩略图`
---
```

### 模板

``` markdown
---
title: 文章标题
date: 2020-01-01
updated: 2020-01-01
comments: true
toc: true
excerpt: 这是一篇文章...
tags:
- tag1
- tag2
categories:
- categories1
cover: /images/logo.ico
thumbnail: /image/logo.ico
---
```

## emoji

[🎁 Emoji cheat sheet for GitHub, Basecamp, Slack & more (webfx.com)](https://www.webfx.com/tools/emoji-cheat-sheet/)

