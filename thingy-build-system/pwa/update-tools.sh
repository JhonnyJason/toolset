#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForPwa.pl
cd ..
pnpm install

echo 0