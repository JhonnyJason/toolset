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
//#region adjustDevConfig
devConfig.mode = "development" 
devConfig.context = process.cwd()
devConfig.entry = entries
if(!devConfig.output) devConfig.output = {}
devConfig.output.filename = "[name].js"
devConfig.output.path = pathModule.resolve(bundlePath, "dev")
devConfig.resolve = { 
    "fallback": {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false 
    }
}
//#endregion

//============================================================
//#region adjustWatchConfig
watchConfig.mode = "development"
watchConfig.context = process.cwd()
watchConfig.watch = true
watchConfig.entry = entries
if(!watchConfig.output) watchConfig.output = {}
watchConfig.output.filename = "[name].js"
watchConfig.output.path = pathModule.resolve(bundlePath, "dev")
watchConfig.resolve = { 
    "fallback": {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false 
    }
}
//#endregion

//============================================================
//#region adjustDeployConfig
deployConfig.mode = "production"
deployConfig.context = process.cwd()
deployConfig.entry = entries
if(!deployConfig.output) deployConfig.output = {}
deployConfig.output.filename = "[name].js"
deployConfig.output.path = pathModule.resolve(bundlePath, "deploy")
deployConfig.resolve = { 
    "fallback": {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false 
    }
}
//#endregion

//#endregion

//============================================================
//#region writeConfigFiles
// function writeIndividualConfigFiles() {
//     let heads = Object.keys(entries)
//     for(let i = 0; i < heads.length; i++) {
//         writeIndividualDevConfig(heads[i], entries[heads[i]])
//         writeIndividualWatchConfig(heads[i], entries[heads[i]])
//     }
// }

// function writeIndividualDevConfig(head, entry) {
//     let config = Object.assign({}, devConfig)
//     config.entry = {}
//     config.entry[head] = entry

//     const configString = exportsString + JSON.stringify(config, null, 4)

//     const filename = "webpack-dev-worker-"+head+".config.js"
//     const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

//     fs.writeFileSync(configPath, configString)    

// }

// function writeIndividualWatchConfig(head, entry) {
//     let config = Object.assign({}, watchConfig)
//     config.entry = {}
//     config.entry[head] = entry

//     const configString = exportsString + JSON.stringify(config, null, 4)

//     const filename = "webpack-watch-worker-"+head+".config.js"
//     const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

//     fs.writeFileSync(configPath, configString)    

// }

const devConfigString = exportsString + JSON.stringify(devConfig, null, 4)
const watchConfigString = exportsString + JSON.stringify(watchConfig, null, 4)
const deployConfigString = exportsString + JSON.stringify(deployConfig, null, 4)


// writeIndividualConfigFiles()

fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
//#endregion