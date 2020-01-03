#!/bin/bash
pushd output/
git pull origin release
git checkout release
git merge master
git push origin release
git checkout master
popd

echo 0