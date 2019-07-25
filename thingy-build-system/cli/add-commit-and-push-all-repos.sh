#!/bin/bash
cd output
git add .
git commit -am "$1"
git push origin master

cd ../toolset
git add .
git commit -am "$1"
git push origin master

cd ../sources
git add .
git commit -am "$1"
git push origin master

cd ../testing
git add .
git commit -am "$1"
git push origin master

cd ..
git add .
git commit -am "$1"
git push origin master

echo 0