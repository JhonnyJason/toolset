#!/bin/bash
cp machine-config.js machine-config-separator/
cd machine-config-separator
mkdir output
node index.js
cp output/commander.pl ../aurox-1-commander/
cp output/soberList ../aurox-1-commander/
cp output/config.js ../aurox-1-webhook-handler/
cp output/ip-address ../aurox-1-webhook-handler/
cp output/port-number ../aurox-1-webhook-handler/
cp output/secret ../aurox-1-webhook-handler/

## push the shit
cd ..
cd aurox-1-commander
git add .
git commit -am "automated update"
git push origin master
cd ..
cd aurox-1-webhook-handler
git add .
git commit -am "automated update"
git push origin master
cd ..
git add .
git commit -am "new deploy"
git push origin master
