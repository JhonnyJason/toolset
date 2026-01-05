const fs = require("fs")
const pathModule = require("path")

//############################################################
//#region pathDefinitions

const configPath = "sources/machine-config.js"
const keysPath = "output/keys"
const serviceFilesPath = "output/service-files"
const nginxFilesPath = "output/nginx-files"

const webpackDevConfig = ".build-config/webpack-dev.config.js"
const webpackWatchConfig = ".build-config/webpack-watch.config.js"
const webpackDeployConfig = ".build-config/webpack-deploy.config.js"

//shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const base = "toolset/thingy-build-system/machine/"
const releaseScript = base + "release-script.sh"
const buildWebpackConfigScript = base + "rebuild-webpack-config.js"
const inspectInstallScript = base + "build-and-inspect.sh"
const createFoldersScript = base + "create-folders.sh"

const createexecutorAndWebhookConfigScript = base + "create-executor-and-webhook-config.js"

const updateToolsScript = base + "update-tools.sh"

//#endregion

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    thingytype: "machine",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            // "initialize-thingy": "run-s -ns create-compile-folders copyscript build",
            "initialize-thingy": "run-s -ns create-folders prepare",

            //webpack Stuff            
            // the Bundling
            "dev-bundle": "webpack-cli --config " + webpackDevConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,
            "deploy-bundle": "webpack-cli --config " + webpackDeployConfig,

            //For testing and building
            "build-dev-installer": "run-s -ns link-all-js-and-json build-live build-coffee dev-bundle",
            "build-installer": "run-s -ns link-all-js-and-json build-live build-coffee deploy-bundle copy-deployment-bundle",
            "watch-installer": "run-p -nsr watch-live watch-coffee watch-bundle",
            "inspect-new-build": "run-s -ns build-dev-installer inspect-install",
            //TODO watch machine config to rebuild executor and webhandlerconfig
            //"watch": ...

            "prepare-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m prepare",
            "refresh-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m refresh",
            "remove-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m remove",

            "generate-files": "run-s -ns generate-nginx-files generate-service-files",
            "generate-nginx-files": "generate-nginx-config-for-thingies " + configPath + " " + nginxFilesPath,
            "generate-service-files": "generate-service-files-for-thingies " + configPath + " " + serviceFilesPath,


            "prepare": "run-s -ns create-executor-and-webhook-config prepare-deployment generate-files rebuild-webpack-config copyscript build-installer",
            "release": "run-s -ns prepare release-script",
            "update-tools": updateToolsScript,
            
            // testing convenience

            // shellscripts to be called
            "copy-deployment-bundle": "cp toolset/build/bundles/deploy/installer.js output/installer.js",
            "release-script": releaseScript,
            "inspect-install": inspectInstallScript,
            "create-executor-and-webhook-config": createexecutorAndWebhookConfigScript,
            "rebuild-webpack-config": buildWebpackConfigScript,
            "create-folders": createFoldersScript,            
            "copyscript": copyScript
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "mustache": "^4.2.0",
            "webpack": "^5.104.1",
            "webpack-cli": "^6.0.1",
            "generate-nginx-config-for-thingies": "^0.1.9",
            "generate-service-files-for-thingies": "^0.1.4",
            "prepare-machine-thingy-deployment": "^0.1.5"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps
    }
}