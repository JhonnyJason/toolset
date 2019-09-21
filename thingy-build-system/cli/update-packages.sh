#!/bin/bash
rm -r output/node_modules
rm output/package-lock.json

cd output
../node_modules/npm-check-updates/bin/ncu -u
npm install
cd ..

cp output/package.json sources/ressources/package.json
cp output/package-lock.json sources/ressources/package-lock.json

echo 0