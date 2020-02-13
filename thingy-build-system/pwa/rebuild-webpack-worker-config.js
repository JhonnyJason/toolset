#!/usr/bin/env node
//============================================================
function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

//============================================================
const pathModule = require("path")
const fs = require("fs")

//============================================================
const jsPath = pathModule.resolve(process.cwd(), "toolset/build/js")
const bundlePath = pathModule.resolve(process.cwd(), "toolset/build/bundles")
const exportsString = "module.exports = "

//============================================================
//#region loadConfigFiles
//============================================================
//#region stringDefinitions
const deployConfigName = "webpack-deploy-worker.config.js"
const devConfigName = "webpack-dev-worker.config.js"
const watchConfigName = "webpack-watch-worker.config.js"

const deployScriptName = "deploy-worker-bundle"
const watchScriptName = "watch-worker-bundle"
const devScriptName = "dev-worker-bundle"
//#endregion

//============================================================
//#region paths
const deployConfigPath = pathModule.resolve(process.cwd(), ".build-config", deployConfigName)
const devConfigPath = pathModule.resolve(process.cwd(), ".build-config", devConfigName)
const watchConfigPath = pathModule.resolve(process.cwd(), ".build-config", watchConfigName)

const packageJsonPath = pathModule.resolve(process.cwd(), "package.json")
//#endregion

//============================================================
//#region loadFiles
var deployConfig = {}
var devConfig = {}
var watchConfig = {}

try {deployConfig = require(deployConfigPath)} catch(error) {}
try {devConfig = require(devConfigPath)} catch(error) {}
try {watchConfig = require(watchConfigPath)} catch(error) {}

const packageJson = require(packageJsonPath)
//#endregion

//#endregion

//============================================================
const jss = fs.readdirSync(jsPath)
var entries = {}
for(var i = 0; i < jss.length; i++) {
    if(jss[i].endsWith("worker.js")) {
        let name = jss[i].substr(0, jss[i].length - 3)
        entries[name] = pathModule.resolve(jsPath, jss[i])
    }
}

//============================================================
//#region adjustConfigs
//============================================================
//#region handleNoWorkerCase
if(Object.keys(entries).length == 0) {
    packageJson.scripts[devScriptName] = "echo 'no worker'"
    packageJson.scripts[watchScriptName] = "echo 'no worker'"
    packageJson.scripts[deployScriptName] = "echo 'no worker'"
    //============================================================
    packageJsonString = JSON.stringify(packageJson, null, 4)
    fs.writeFileSync(packageJsonPath, packageJsonString)
    return
}

//#endregion

//============================================================
//#region adjustDevConfig
devConfig.mode = "development" 
devConfig.devtool = "none"
devConfig.context = process.cwd()
devConfig.entry = entries
if(!devConfig.output) devConfig.output = {}
devConfig.output.filename = "[name].js"
devConfig.output.path = pathModule.resolve(bundlePath, "dev")
//#endregion

//============================================================
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

//============================================================
//#region adjustDeployConfig
deployConfig.mode = "production"
deployConfig.context = process.cwd()
deployConfig.entry = entries
if(!deployConfig.output) deployConfig.output = {}
deployConfig.output.filename = "[name].js"
deployConfig.output.path = pathModule.resolve(bundlePath, "deploy")
//#endregion

//#endregion

//============================================================
//#region writeConfigFiles
const devConfigString = exportsString + JSON.stringify(devConfig, null, 4)
const watchConfigString = exportsString + JSON.stringify(watchConfig, null, 4)
const deployConfigString = exportsString + JSON.stringify(deployConfig, null, 4)

fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
//#endregion