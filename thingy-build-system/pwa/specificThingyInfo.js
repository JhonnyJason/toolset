const fs = require("fs")
const pathModule = require("path")

const stylusHeads = "sources/source/*/*[^style].styl"
const cssDest = "toolset/compiled/css/"
const pugHeads = "sources/page-heads/*/*[^include].pug"
const htmlDest = "output/"
const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"

const toolsetPwaBase = "toolset/thingy-build-system/pwa/"
const createFoldersScript = toolsetPwaBase + "create-compile-folders.sh" 
const releaseScript = toolsetPwaBase + "release-script.sh"


var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "pwa",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns patch-stuff create-compile-folders build copyscript",

            //the generalBase already includes a script named "build-coffee" and "watch-coffee"
            "build-js": "run-s -ns build-coffee bundle",
            "watch-js": "run-p -nsr watch-coffee watch-bundle",
            
            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,
            
            "build-styl": "stylus " + stylusHeads + " -o " + cssDest,
            "watch-styl": "stylus " + stylusHeads + " -o " + cssDest + " -w",
            
            "build-index-pug": "pug -o " + htmlDest + " " + pugHeads,
            "watch-index-pug": "pug -o " + htmlDest + " " + pugHeads + " -w",
            
            //For testing and building
            "test": "run-s -ns build watch",
            "build": "run-s -ns build-styl build-js build-index-pug",
            "watch": "run-p -nsr watch-js watch-styl watch-index-pug ui-sync",
            "release": "run-s -ns initialize-thingy release-script",
            //synced testing
            "ui-sync": "browser-sync start --server '" + htmlDest + "' --files '" + htmlDest + "index.html' --no-open",
            
            // shellscripts to be called            
            "release-script": releaseScript,
            "patch-stuff": patchScript,
            "copyscript": copyScript,
            "create-compile-folders": createFoldersScript
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "browser-sync": "^2.26.3",
            "pug-cli": "^1.0.0-alpha6",
            "stylus": "^0.54.5",
            "webpack": "^4.29.0",
            "webpack-cli": "^3.2.1"      
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    }
}