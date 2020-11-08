#!/bin/bash
npm run pull
cd toolset
./prepareThingyForPackage.pl
cd ..
toolset/thingy-build-system/package/sync-versions.js
npm install

echo 0