#!/bin/bash
rm -r toolset/local-build
#phonegap create local-build --id 'com.auroxtech.headbandapp' --name 'Aurox Headband App' --link-to aurox-app-phonegap-build/www
phonegap create toolset/local-build --link-to toolset/cordova-source
ln -s ../cordova-source/res toolset/local-build/res
ln -s ../cordova-source/scripts toolset/local-build/scripts
