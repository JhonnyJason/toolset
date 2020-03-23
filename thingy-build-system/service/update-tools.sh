#!/bin/bash
npm run pull
cd toolset
./prepareThingyForService.pl
cd ..
npm install

echo 0