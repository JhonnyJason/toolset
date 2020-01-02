#!/usr/bin/node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const jsPath = pathModule.resolve(process.cwd(), "output/build/js")
const bundlePath = pathModule.resolve(process.cwd(), "output/build/bundles")
const exportsString = "module.exports = "

//#region configFileStuff
const deployConfigName = "webpack-deploy-worker.config.js"
const devConfigName = "webpack-dev-worker.config.js"
const watchConfigName = "webpack-watch-worker.config.js"

const deployConfigPath = pathModule.resolve(process.cwd(), deployConfigName)
const devConfigPath = pathModule.resolve(process.cwd(), devConfigName)
const watchConfigPath = pathModule.resolve(process.cwd(), watchConfigName)

var deployConfig = {}
var devConfig = {}
var watchConfig = {}

try {deployConfig = require(deployConfigPath)} catch(error) {}
try {devConfig = require(devConfigPath)} catch(error) {}
try {watchConfig = require(watchConfigPath)} catch(error) {}
//#endregion

const jss = fs.readdirSync(jsPath)
var entries = {}
for(var i = 0; i < jss.length; i++) {
    if(jss[i].endsWith("worker.js")) {
        let name = jss[i].substr(0, jss[i].length - 3)
        entries[name] = pathModule.resolve(jsPath, jss[i])
    }
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