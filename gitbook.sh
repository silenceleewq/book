#! /bin/bash

gitbook build

git add --all

git commit -am "default commit message"

git push

cp -R _book/ $HOME/BookSource/ # 将 _book 下生成的内容都复制到一个指定的地方.

cd  $HOME/BookSource/

git add --all

git commit -am "default commit message"

git push

