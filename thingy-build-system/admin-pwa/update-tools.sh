#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForAdminPwa.pl
cd ..
pnpm install

echo 0