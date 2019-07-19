#!/bin/bash
git submodule update --init --recursive
cd sources/
git checkout master
cd ../toolset/
git checkout master
cd ../testing/
git checkout master
cd ../output/
git checkout master
cd ios-source/
git checkout master
cd ../android-source/
git checkout master
## TODO add the other shit
cd ../../toolset/git-hooks/
./install-hooks.pl

echo 0
