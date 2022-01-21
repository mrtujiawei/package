#!/bin/bash
#Filename: split.sh
#Author: Mr Prince
#Date: 2021-08-22 18:04:25

NAME=$1

if [ -z $NAME ]
then
  echo "{name}.mp4 file's name is not input"
  exit 1
fi

ffmpeg -ss 00:00:00 -i "$NAME.mp4" -c copy -t 01:30:00 "$NAME-1".mp4
ffmpeg -ss 01:30:00 -i "$NAME.mp4" -c copy -t 01:30:00 "$NAME-2".mp4
