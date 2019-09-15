#!/bin/bash
git pull origin master
git checkout master


cd toolset
git pull origin master
git checkout master

cd ../sources
git pull origin master
git checkout master

cd ../testing
git pull origin master
git checkout master

cd ../output
git pull origin master
git checkout master

echo 0