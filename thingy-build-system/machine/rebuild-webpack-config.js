#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const indexPath = pathModule.resolve(process.cwd(), "toolset/build/js/index.js")
const bundlePath = pathModule.resolve(process.cwd(), "toolset/build/bundles")
const exportsString = "module.exports = "

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

//#region defineConfigFiles
commonConfig = {
    context: process.cwd(),
    target: "node",
    entry: indexPath
}

//#region adjustDevConfig
Object.assign(devConfig, commonConfig)
devConfig.mode = "development"
if(!devConfig.output) devConfig.output = {}
devConfig.output.filename = "installer.js"
devConfig.output.path = pathModule.resolve(bundlePath, "dev")
//#endregion

//#region adjustWatchConfig
Object.assign(watchConfig, commonConfig)
watchConfig.mode = "development"
watchConfig.watch = true
if(!watchConfig.output) watchConfig.output = {}
watchConfig.output.filename = "installer.js"
watchConfig.output.path = pathModule.resolve(bundlePath, "dev")
//#endregion

//#region adjustDeployConfig
Object.assign(deployConfig, commonConfig)
deployConfig.mode = "production"
if(!deployConfig.output) deployConfig.output = {}
deployConfig.output.filename = "installer.js"
deployConfig.output.path = pathModule.resolve(bundlePath, "deploy")
//#endregion
//#endregion

//#region writeConfigFiles
const devConfigString = exportsString + JSON.stringify(devConfig, null, 4)
const watchConfigString = exportsString + JSON.stringify(watchConfig, null, 4)
const deployConfigString = exportsString + JSON.stringify(deployConfig, null, 4)

fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
//#endregion