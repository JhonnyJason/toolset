#!/usr/bin/node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
const sourceHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/js")
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

const heads = fs.readdirSync(headsPath)
const jsHeads = (heads).map(head => head + ".js")
var entries = {}
for(var i = 0; i < heads.length; i++) {
    entries[heads[i]] = pathModule.resolve(sourceHeadsPath, jsHeads[i])
}
//#region defineConfigFiles
//#region adjustDevConfig
devConfig.mode = "development" 
devConfig.devtool = "none"
devConfig.context = process.cwd()
devConfig.entry = entries
if(!devConfig.output) devConfig.output = {}
devConfig.output.filename = "[name].js"
devConfig.output.path = pathModule.resolve(bundlePath, "dev")
//#endregion

//#region adjustWatchConfig
watchConfig.mode = "development"
watchConfig.devtool = "none"
watchConfig.context = process.cwd()
watchConfig.watch = true
watchConfig.entry = entries
if(!watchConfig.output) watchConfig.output = {}
watchConfig.output.filename = "[name].js"
watchConfig.output.path = pathModule.resolve(bundlePath, "dev")
//#endregion

//#region adjustDeployConfig
deployConfig.mode = "production"
deployConfig.context = process.cwd()
deployConfig.entry = entries
if(!deployConfig.output) deployConfig.output = {}
deployConfig.output.filename = "[name].js"
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