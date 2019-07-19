#!/bin/bash
cd output/android-source/
git pull origin release
git checkout release
git merge master
git push origin release
git checkout master
cd ..

echo 0