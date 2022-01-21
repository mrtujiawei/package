#!/bin/bash
# 写一些初始化系统的操作
# 以后直接拿着这个脚本就可以完成所有软件的安装
# 默认这个文件有root权限
# 使用的使用用 cat > init.sh
# 输入完成后用 ctrl+d 结束
# @filename: init.sh
# @author: Mr Prince
# @date: 2020年08月05日 星期三 19时58分43秒

# vim 一些配置文件的路径
VIM_CONFIG_PATH="/home/tujiawei"
FILE_OWNER="tujiawei"

# 下载最新 vim

# 通过源安装,不一定是最新的
# 安装vim 尽量装最新的，因为插件不支持旧版的
# add-apt-repository ppa:jonathonf/vim
# apt-get update
#
# apt-get install -y vim
#
# cat >> /etc/vim/vimrc <<EOF
# if filereadable(expand("~/.vim/.vimrc"))
#   source ~/.vim/.vimrc
# endif
# EOF

# 最好是什么多没做的时候下载
# 等切换完镜像再下载就会出现部分依赖安装失败
function VimInstall() {
  apt update

  # 下载依赖，如果有了再安装一遍也没问题
  apt install git make clang libtool-bin -y
  GitDownload https://github.com/vim/vim.git --depth 1
  cd vim/src
  make
  make install
  cd -
  rm vim -rf
}

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


# 有给所有者就用所有者的，否则就是我自己
if [ "$1" ]
then
  FILE_OWNER="$1"
fi

# 如果不是root，尝试添加用户，反正报错不影响下面的代码
if [ "root" != "$FILE_OWNER" ]
then
  adduser $FILE_OWNER
fi

VimInstall

# function mkdirSelf() {
#   mkdir -p "$1"
#   chmod 775 "$1"
#   chown "$2:$2" "$1"
# }

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
apt-get install -y wget git


# 安装指定版本的 node
# 修改版本改 17
wget -qO- https://deb.nodesource.com/setup_17.x | bash -
apt-get install -y nodejs

# 切换淘宝镜像
npm config set registry http://registry.npm.taobao.org/

# 安装yarn是为了代码提示
npm i -g yarn

# 初始化vim的临时文件
# mkdirSelf "$VIM_CONFIG_PATH/.vim" "$FILE_OWNER"
# mkdirSelf "$VIM_CONFIG_PATH/.vim/.backup" "$FILE_OWNER"
# mkdirSelf "$VIM_CONFIG_PATH/.vim/.swp" "$FILE_OWNER"
# mkdirSelf "$VIM_CONFIG_PATH/.vim/.undo" "$FILE_OWNER"
# mkdirSelf "$VIM_CONFIG_PATH/.cache/" "$FILE_OWNER"

# 复制一波自己写的脚本
# 要是git能下载快一点就好了
GitDownload https://github.com/Mr-Promise/shell.git --depth 1

rm -rf /usr/bin/toggle-npm-mirror
cp shell/src/toggle-npm-mirror /usr/bin/
toggle-npm-mirror taobao
rm -rf shell

GitDownload https://github.com/Mr-Promise/vimrc.git --depth 1 "$VIM_CONFIG_PATH/.vim"

# cp vimrc/vimrc "$VIM_CONFIG_PATH/.vim/vimrc"
# cp vimrc/coc-settings.json "$VIM_CONFIG_PATH/.vim/coc-settings.json"

# rm -rf vimrc

# 放在下面的原因是安装的时候会进入vim
# 后面的脚本就执行不下去了
# 安装vundle vim包管理工具
GitDownload https://github.com/VundleVim/Vundle.vim.git --depth 1 "$VIM_CONFIG_PATH/.vim/bundle/Vundle.vim"

chown -R "$FILE_OWNER:$FILE_OWNER" "$VIM_CONFIG_PATH/.vim/"

# 切换 tujiawei 安装插件
# 失败几率比较大，所以重试两次
su - tujiawei -c "vim +PluginInstall +qall && vim +PluginInstall +qall && vim +PluginInstall +qall && vim -c ':call mkdp#util#install()' +qall"

# coc-nvim 需要手动更新一下
cd "$VIM_CONFIG_PATH/.vim/bundle/coc.nvim/"
yarn
cd -

# fzf 配置

echo "export FZF_DEFAULT_COMMAND=\"find -type f | grep -Ev '/node_modules|/.git/|/dev/|/prod/|/dist/|/.pub/|/.mozilla/|/.java/|/.dartServer/|/.local/|/.node-gyp/|/.gradle/'\"" >> "$VIM_CONFIG_PATH/.bashrc"
echo -e "export FZF_DEFAULT_OPTS=\"--layout=reverse --inline-info --preview 'batcat --color=always --style=numbers --line-range=:50 {}'\"" >> "$VIM_CONFIG_PATH/.bashrc"

source "$VIM_CONFIG_PATH/.bashrc"

# ctags
apt-get install -y universal-ctags

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
