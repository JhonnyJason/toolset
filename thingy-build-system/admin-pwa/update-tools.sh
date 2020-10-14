#!/bin/bash
npm run pull
cd toolset
./prepareThingyForAdminPwa.pl
cd ..
npm install

echo 0