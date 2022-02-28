#!/bin/bash
#Filename: combine.sh
#Author: Mr Prince
#Date: 2021-08-23 17:57:43
NAME=$1
PORT=$2

# 如果没传名字，生成一个随机的名字
if [ -z $NAME ]
then
  NAME=`date +%s | md5sum | awk '{print $1}' | cut -c 23-`
fi

if [ -z $PORT ]
then
  PORT=7777
fi

echo "ffmpeg -i http://127.0.0.1:$PORT/index.m3u8 -threads 5 -preset ultrafast \"$NAME.mp4\""

ffmpeg -i "http://127.0.0.1:$PORT/index.m3u8" -threads 5 -preset ultrafast "$NAME.mp4"
