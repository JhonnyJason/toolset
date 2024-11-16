#!/bin/bash
rm -r output/node_modules
rm output/package-lock.json

ncu -u --cwd output

cd output
pnpm install
cd ..

cp output/package.json sources/ressources/package.json

echo 0