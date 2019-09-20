#!/bin/bash
cd output/

rm -r node_modules
rm package-lock.json

npm update

cp package.json ../sources/ressources/package.json
cp package-lock.json ../sources/ressources/package-lock.json

echo 0