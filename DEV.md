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
ncu -u
npm install
npm install hexo-filter-github-emojis --save
# npm uninstall -g hexo-cli
npm list -g
```

[Icarus快速上手 - Icarus (ppoffice.github.io)](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/icarus快速上手/#install-npm)

``` bash
hexo config theme icarus
hexo server
# https://githubmemory.com/repo/ppoffice/hexo-theme-icarus/issues/855?page=3
npm install --save bulma-stylus hexo-renderer-inferno
hexo server
```

