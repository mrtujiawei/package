#!/bin/bash
# 写一些初始化系统的操作
# 以后直接拿着这个脚本就可以完成所有软件的安装
# 默认这个文件有root权限
# 使用的使用用 cat > init.sh
# 输入完成后用 ctrl+d 结束
# 这是专门给 root 用户用的
# @filename: root-init.sh
# @author: Mr Prince
# @date: 2021年02月09日 星期三 10时58分43秒

# git 下载重试 直到成功为止
function GitDownload() {
  while [ 1 -eq 1 ]
  do
    git clone $@
    if [ 0 -ne $? ]
    then
      echo "git clone $@ failed"
    else
      break
    fi
  done
}


# 最好是什么多没做的时候下载
# 等切换完镜像再下载就会出现部分依赖安装失败
# 安装教程: https://github.com/vim/vim/blob/master/src/INSTALL
function VimInstall() {
  apt update

  # 下载依赖，如果有了再安装一遍也没问题
  apt install git make clang libtool-bin -y

  # 支持剪切板，并且这是gui的依赖项
  apt install libxt-dev -y

  # 支持gui,需要支持一下字体
  apt install libgtk-3-dev -y

  # 支持 python
  # 在Makefil里 把下面这行的注释去掉
  # CONF_OPT_PYTHON3 = --enable-python3interp
  # 没有什么办法能让脚本在这里停下来
  # 除非写成两个
  apt install libpython3-dev -y

  GitDownload https://github.com/vim/vim.git --depth 1
  cd vim/src
  make reconfig
  make
  make install
  cd -
  rm vim -rf
}

VimInstall

# 备份一下sources.list
cp /etc/apt/sources.list /etc/apt/sources.list.back

# 使用阿里云镜像
echo "
deb-src http://archive.ubuntu.com/ubuntu focal main restricted #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ focal restricted main multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal universe
deb http://mirrors.aliyun.com/ubuntu/ focal multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security restricted main multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal-security universe
deb http://mirrors.aliyun.com/ubuntu/ focal-security multiverse
deb http://security.ubuntu.com/ubuntu/ focal-security restricted main multiverse universe
" > /etc/apt/sources.list

apt-get update
apt-get install wget git -y

# 安装指定版本的 node
# 修改版本改 17
wget -qO- https://deb.nodesource.com/setup_17.x | bash -
apt-get install -y nodejs

# 复制一波自己写的脚本
# 要是git能下载快一点就好了
GitDownload https://github.com/mrtujiawei/package.git --depth 1

rm -rf /usr/bin/toggle-npm-mirror
cp package/packages/bin/src/shell/toggle-npm-mirror.sh /usr/bin/toggle-npm-mirror
toggle-npm-mirror taobao
rm -rf shell

# 安装yarn是为了代码提示
npm i -g yarn

GitDownload https://github.com/mrtujiawei/vimrc.git --depth 1 ~/.vim

# 放在下面的原因是安装的时候会进入vim
# 后面的脚本就执行不下去了
# 安装vundle vim包管理工具
GitDownload https://github.com/VundleVim/Vundle.vim.git --depth 1 ~/.vim/bundle/Vundle.vim

# 失败几率比较大，所以重试两次
vim +PluginInstall +qall && vim +PluginInstall +qall && vim +PluginInstall +qall && vim -c ':call mkdp#util#install()' +qall

# coc-nvim 需要手动更新一下
cd ~/.vim/bundle/coc.nvim/
yarn
cd -

# fzf 配置

echo "export FZF_DEFAULT_COMMAND=\"find -type f | grep -Ev '/node_modules|/.git/|/dev/|/prod/|/dist/|/.pub/|/.mozilla/|/.java/|/.dartServer/|/.local/|/.node-gyp/|/.gradle/'\"" >> ~/.bashrc
echo -e "export FZF_DEFAULT_OPTS=\"--layout=reverse --inline-info --preview 'batcat --color=always --style=numbers --line-range=:50 {}'\"" >> ~/.bashrc
source ~/.bashrc

# ctags
apt-get install universal-ctags -y

# tmux zsh
apt-get install tmux zsh -y

# onmyzsh 配置
GitDownload https://github.com/ohmyzsh/ohmyzsh.git --depth 1
./ohmyzsh/tools/install.sh
rm onmyzsh

# 模糊搜索 不需要自己下，直接 vim 里 PluginInstall 就可以了
# apt-get install fzf
# 下面这两个是增强的，暂时不需要
# apt-get install ripgrep
# apt-get install silversearcher-ag
# 这东西有点难下,暂时不用
# wget https://github.com/sharkdp/fd/releases/download/v7.3.0/fd-musl_7.3.0_amd64.deb
# dpkg -i fd-musl_7.3.0_amd64.deb
# rm fd-musl_7.3.0_amd64.deb -rf

exit

## 以下部分视情况安装 ##

# 如果没有界面，页面没必要用这个了
# 为了剪切板
# 选择中国上海
apt-get install -y vim-gtk

# sshpass ssh输入密码

# 非常酷的文件浏览器
apt-get install -y ranger

# top 可视化
npm install -g vtop

# 测网速
npm i -g speed-test

# vim 字体
pip install --user powerline-status
