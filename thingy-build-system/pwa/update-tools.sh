#!/bin/bash
npm run pull
cd toolset
./prepareThingyForPwa.pl
cd ..
npm install

echo 0