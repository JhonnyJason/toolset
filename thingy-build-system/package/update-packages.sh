#!/bin/bash
rm -r output/node_modules
rm output/package-lock.json

cd output
../node_modules/npm-check-updates/build/src/bin/cli.js -u
npm install
cd ..

cp output/package.json sources/ressources/package.json

echo 0