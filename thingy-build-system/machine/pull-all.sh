#!/bin/bash
git checkout master
git pull origin master

cd ../toolset
git checkout master
git pull origin master

cd ../sources
git checkout master
git pull origin master

cd ../output
git checkout master
git pull origin master

cd ../testing
git checkout master
git pull origin master

echo 0