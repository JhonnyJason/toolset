#!/bin/bash
npm run pull
cd toolset
./prepareThingyForCli.pl
cd ..
toolset/thingy-build-system/cli/sync-versions.js
npm install

echo 0