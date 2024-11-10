#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForPackage.pl
cd ..
toolset/thingy-build-system/package/sync-versions.js
pnpm install

echo 0