#!/bin/bash
npm run pull
cd toolset
./prepareThingyForCli.pl
cd ..
## adjust and increment version?
npm install
npm update-cli-packages
npm run push "updated packages"

echo 0