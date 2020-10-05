#!/bin/bash
npm run pull
cd toolset
./prepareThingyForMachine.pl
cd ..
npm install

echo 0