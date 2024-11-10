#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForCli.pl
cd ..
toolset/thingy-build-system/cli/sync-versions.js
pnpm install

echo 0