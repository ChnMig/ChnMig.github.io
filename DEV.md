
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

