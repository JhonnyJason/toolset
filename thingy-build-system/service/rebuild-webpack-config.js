#!/usr/bin/env node
//############################################################
function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}
//############################################################
const pathModule = require("path")
const fs = require("fs")

//############################################################
const entryPath = pathModule.resolve(process.cwd(), "toolset/build/js/index.js")
const bundlePath = pathModule.resolve(process.cwd(), "output/")
const exportsString = "module.exports = "

//############################################################
//#region configFileStuff
const deployConfigName = "webpack-deploy.config.js"
const devConfigName = "webpack-dev.config.js"
const watchConfigName = "webpack-watch.config.js"

const deployConfigPath = pathModule.resolve(process.cwd(), ".build-config", deployConfigName)
const devConfigPath = pathModule.resolve(process.cwd(), ".build-config", devConfigName)
const watchConfigPath = pathModule.resolve(process.cwd(), ".build-config", watchConfigName)

var deployConfig = {}
var devConfig = {}
var watchConfig = {}

try {deployConfig = require(deployConfigPath)} catch(error) {}
try {devConfig = require(devConfigPath)} catch(error) {}
try {watchConfig = require(watchConfigPath)} catch(error) {}
//#endregion

//############################################################
//#region defineConfigFiles
config = {
    target: "node",
    entry: entryPath,
    context: process.cwd(),
    output: {
        filename: 'service.js',
        path: bundlePath,
    }
}

//############################################################
devConfig = Object.assign(devConfig, config)
devConfig.mode = "development" 

//############################################################
watchConfig = Object.assign(watchConfig, devConfig)
watchConfig.watch = true

//############################################################
deployConfig = Object.assign(deployConfig, config)
deployConfig.mode = "production" 

//#endregion

//############################################################
//#region writeConfigFiles
const devConfigString = exportsString + JSON.stringify(devConfig, null, 4)
const watchConfigString = exportsString + JSON.stringify(watchConfig, null, 4)
const deployConfigString = exportsString + JSON.stringify(deployConfig, null, 4)

fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
//#endregion