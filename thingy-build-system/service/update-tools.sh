#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForService.pl
cd ..
pnpm install

echo 0