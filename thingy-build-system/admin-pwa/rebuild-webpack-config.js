#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
const sourceHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/js")
const bundlePath = pathModule.resolve(process.cwd(), "toolset/build/bundles")
const pwaHeadsPath = pathModule.resolve(process.cwd(), "pwa-sources/page-heads")
const pwaSourceHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/pwa-js")
const exportsString = "module.exports = "

//#region configFileStuff
const deployConfigName = "webpack-deploy.config.js"
const devConfigName = "webpack-dev.config.js"
const watchConfigName = "webpack-watch.config.js"
const pwaConfigName = "webpack-pwa.config.js"

const deployConfigPath = pathModule.resolve(process.cwd(), ".build-config", deployConfigName)
const devConfigPath = pathModule.resolve(process.cwd(), ".build-config", devConfigName)
const watchConfigPath = pathModule.resolve(process.cwd(), ".build-config", watchConfigName)
const pwaConfigPath = pathModule.resolve(process.cwd(), ".build-config", pwaConfigName)

var deployConfig = {}
var devConfig = {}
var watchConfig = {}
var pwaConfig = {}

try {deployConfig = require(deployConfigPath)} catch(error) {}
try {devConfig = require(devConfigPath)} catch(error) {}
try {watchConfig = require(watchConfigPath)} catch(error) {}
try {pwaConfig = require(pwaConfigPath)} catch(error) {}
//#endregion

const heads = fs.readdirSync(headsPath)
const pwaHeads = fs.readdirSync(pwaHeadsPath)
const jsHeads = (heads).map(head => head + ".js")
const pwaJSHeads = (pwaHeads).map(head => head + ".js")
var entries = {}
for(var i = 0; i < heads.length; i++) {
    entries[heads[i]] = pathModule.resolve(sourceHeadsPath, jsHeads[i])
}
var pwaJSEntries = {}
for(var i = 0; i < pwaHeads.length; i++) {
    pwaJSEntries[pwaHeads[i]] = pathModule.resolve(pwaSourceHeadsPath, pwaJSHeads[i])
}

//#region defineConfigFiles
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

//#region adjustPWAConfig
pwaConfig.mode = "production"
pwaConfig.context = process.cwd()
pwaConfig.entry = pwaJSEntries
if(!pwaConfig.output) pwaConfig.output = {}
pwaConfig.output.filename = "[name].js"
pwaConfig.output.path = pathModule.resolve(bundlePath, "pwa")
pwaConfig.resolve = { 
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
const pwaConfigString = exportsString + JSON.stringify(pwaConfig, null, 4)

writeIndividualConfigFiles()


fs.writeFileSync(devConfigPath, devConfigString)
fs.writeFileSync(watchConfigPath, watchConfigString)
fs.writeFileSync(deployConfigPath, deployConfigString)
fs.writeFileSync(pwaConfigPath, pwaConfigString)
//#endregion