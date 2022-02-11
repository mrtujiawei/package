#!/bin/bash
#Filename: /home/tujiawei/github/package/packages/bin/src/shell/vim-install.sh
#Author: Mr Prince
#Date: 2022-02-11 17:05:08
# vim 安装
# 携程两个的原因是安装过程中需要修改文件

function Step1() {
  sudo apt update

  # 下载依赖，如果有了再安装一遍也没问题
  sudo apt install git make clang libtool-bin -y

  # 支持剪切板，并且这是gui的依赖项
  sudo apt install libxt-dev -y

  # 支持gui,需要支持一下字体
  sudo apt install libgtk-3-dev -y

  # 支持pytho3
  sudo apt install libpython3-dev -y

  echo "uncomment "
}

function Step2() {
  # 在Makefil里 把下面这行的注释去掉
  # CONF_OPT_PYTHON3 = --enable-python3interp

  GitDownload https://github.com/vim/vim.git --depth 1
  cd vim/src
  make reconfig
  make
  sudo make install
  cd -
  rm vim -rf

}
