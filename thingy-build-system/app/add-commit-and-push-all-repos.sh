#!/bin/bash
cd toolset/cordova-source
cp -r www/* ../../output/ios-source/www/
cp -r www/* ../../output/android-source/app/src/main/assets/www/
cp merges/ios/index.html ../../output/ios-source/www/
cp merges/android/index.html ../../output/android-source/app/src/main/assets/www/
cd ../../output/android-source
git add .
git commit -am "$1"
git push origin master
cd ../ios-source/
git add .
git commit -am "$1"
git push origin master
cd ..
git add .
git commit -am "$1"
git push origin master
cd ../sources
git add .
git commit -am "$1"
git push origin master
cd ../toolset
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