//############################################################
const fs = require("fs")
const pathModule = require("path")

//############################################################
//#region pathDefinitions
const servicePath = "output/service.js"

const webpackDevConfig = ".build-config/webpack-dev.config.js"
const webpackWatchConfig = ".build-config/webpack-watch.config.js"
const webpackDeployConfig = ".build-config/webpack-deploy.config.js"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"

const base = "toolset/thingy-build-system/service/"
const createCertificatesScript = base + "create-certificates.sh"
const buildWebpackConfigScript = base + "rebuild-webpack-config.js"
const releaseScript = base + "release-script.sh"
const createBuildDirectoriesScript = base + "create-build-directories.sh"
const updateToolsScript = base + "update-tools.sh"

//#endregion

//############################################################
//#region getSourceInfo
var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}
//#endregion

//############################################################
module.exports = {
    thingytype: "service",
    //############################################################
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns create-build-directories copy-ressources create-cert build",

            //webpack Stuff
            "prepare-webpack": "run-s rebuild-webpack-config patch-stuff",
            "bundle": "webpack-cli --config " + webpackDeployConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,

            "release": "run-s -ns initialize-thingy release-script",

            //For testing and building
            "watch": "run-p -rns watch-live watch-coffee watch-bundle",
            "test": "run-s -ns build test-run",
            "build": "run-s -ns prepare-webpack link-all-js-and-json build-live build-coffee bundle",
            "test-run": "cd output && node service.js",
            
            //helper scripts
            "create-cert": createCertificatesScript,
            "update-tools": updateToolsScript,
            "rebuild-webpack-config": buildWebpackConfigScript,
            "release-script": releaseScript,
            "create-build-directories": createBuildDirectoriesScript,
            "patch-stuff": patchScript,
            "copy-ressources": copyScript
        }
    },
    //############################################################
    getDependencies: () => {
        
        var thingyDeps = {
            "webpack": "^5.104.1",
            "webpack-cli": "^6.0.1"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    }
}
