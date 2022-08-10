#!/usr/bin/env node
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
devConfig.context = process.cwd()
devConfig.entry = entries
if(!devConfig.output) devConfig.output = {}
devConfig.output.filename = "[name].js"
devConfig.output.path = pathModule.resolve(bundlePath, "dev")
devConfig.output.publicPath = ""
devConfig.resolve = { 
    "fallback": {
        "buffer": false,
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

//#region adjustWatchConfig
watchConfig.mode = "development"
watchConfig.context = process.cwd()
watchConfig.watch = true
watchConfig.entry = entries
if(!watchConfig.output) watchConfig.output = {}
watchConfig.output.filename = "[name].js"
watchConfig.output.path = pathModule.resolve(bundlePath, "dev")
watchConfig.output.publicPath = ""
watchConfig.resolve = { 
    "fallback": {
        "buffer": false,
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

//#region adjustDeployConfig
deployConfig.mode = "production"
deployConfig.context = process.cwd()
deployConfig.entry = entries
if(!deployConfig.output) deployConfig.output = {}
deployConfig.output.filename = "[name].js"
deployConfig.output.path = pathModule.resolve(bundlePath, "deploy")
deployConfig.output.publicPath = ""
deployConfig.resolve = { 
    "fallback": {
        "buffer": false,
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

//#region writeConfigFiles

function writeIndividualConfigFiles() {
    let heads = Object.keys(entries)
    for(let i = 0; i < heads.length; i++) {
        writeIndividualDevConfig(heads[i], entries[heads[i]])
        writeIndividualWatchConfig(heads[i], entries[heads[i]])
    }
}

function writeIndividualDevConfig(head, entry) {
    let config = Object.assign({}, devConfig)
    config.entry = {}
    config.entry[head] = entry

    const configString = exportsString + JSON.stringify(config, null, 4)

    const filename = "webpack-dev-"+head+".config.js"
    const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

    fs.writeFileSync(configPath, configString)    

}

function writeIndividualWatchConfig(head, entry) {
    let config = Object.assign({}, watchConfig)
    config.entry = {}
    config.entry[head] = entry

    const configString = exportsString + JSON.stringify(config, null, 4)

    const filename = "webpack-watch-"+head+".config.js"
    const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

    fs.writeFileSync(configPath, configString)    

}

const devConfigString = exportsString + JSON.stringify(devConfig, null, 4)
const watchConfigString = exportsString + JSON.stringify(watchConfig, null, 4)
const deployConfigString = exportsString + JSON.stringify(deployConfig, null, 4)

writeIndividualConfigFiles()


fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
//#endregion