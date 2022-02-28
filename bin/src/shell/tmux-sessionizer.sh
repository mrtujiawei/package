#!/bin/bash
#Filename: bin/src/shell/tmux-sessionizer.sh
#Author: Mr Prince
#Date: 2022-01-29 16:55:44
# 运行这个脚本的前提是我已经在tmux里面了

SESSION=$(find ~/github ~/work -type d | fzf)
SESSION_NAME=$(basename "$SESSION" | tr . _)

if ! tmux has-session -t "$SESSION_NAME"
then
  tmux new-session -s "$SESSION_NAME" -c "$SESSION" -d
fi

tmux switch-client -t "$SESSION_NAME"
