#!/bin/bash
pnpm run pull
cd toolset
./prepareThingyForMachine.pl
cd ..
pnpm install

echo 0