#! /bin/bash

gitbook build

git add --all

git commit -am "default commit message"

pc git push

cp -R _book/ $HOME/git_repository/book/ # 将 _book 下生成的内容都复制到一个指定的地方.

cd  $HOME/git_repository/book/

git add --all

git commit -am "default commit message"

pc git push

