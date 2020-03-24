#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const configBasePath = pathModule.resolve(process.cwd(), ".build-config/")

const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

const devBundleScriptName = "dev-bundle"
const devWorkerBundleScriptName = "dev-worker-bundle"
const watchBundleScriptName = "watch-bundle"
const watchWorkerBundleScriptName = "watch-worker-bundle"

var allDevBundleLine = "run-p"
var allDevWorkerBundleLine = "run-p"
var allWatchBundleLine = "run-p"
var allWatchWorkerBundleLine = "run-p"

//#endregion

if(heads.length == 1) {
    packageJSON.scripts[devBundleScriptName] = getDevBundleLine(heads[0])
    packageJSON.scripts[watchBundleScriptName] = getWatchBundleLine(heads[0])
} else if(heads.length > 1) {
    heads.forEach(injectScripts)
    packageJSON.scripts[devBundleScriptName] = allDevBundleLine
    packageJSON.scripts[watchBundleScriptName] = allWatchBundleLine
}

//TODO handle worker bundles somehow...
packageJSON.scripts[watchWorkerBundleScriptName] = "echo 'no worker support yet!'"    
packageJSON.scripts[devWorkerBundleScriptName] = "echo 'no worker support yet!'"

//#region injectionFunctions
function injectScripts(head) {
    injectDevBundleScript(head)
    injectWatchBundleScript(head)
}

//#region lineInjectFunctions
function injectDevBundleScript(head) {
    const scriptName = "dev-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getDevBundleLine(head)
    allDevBundleLine += " " + scriptName
}
function injectDevWorkerBunldeScript(head) {
    const scriptName = "dev-worker-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getDevWorkerBundleLine(head)
    allDevWorkerBundleLine += " " + scriptName
}
function injectWatchBundleScript(head) {
    const scriptName = "watch-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getWatchBundleLine(head)
    allWatchBundleLine += " " + scriptName
}
function injectWatchWorkerBundleScript(head) {
    const scriptName = "watch-worker-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getWatchWorkerBundleLine(head)
    allWatchWorkerBundleLine += " " + scriptName
}

//#endregion

//#region getSpecificScriptLines
function getDevBundleLine(head) {
    const configFileName = "webpack-dev-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
function getDevWorkerBundleLine(head) {
    const configFileName = "webpack-dev-worker-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
function getWatchBundleLine(head) {
    const configFileName = "webpack-watch-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
function getWatchWorkerBundleLine(head) {
    const configFileName = "webpack-watch-worker-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
//#endregion

//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion