#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const coffeeExpression = "sources/source/*/*.coffee"

const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

const connectScriptName = "connect-dom"
const watchConnectScriptName = "watch-connect-dom"

var allConnectLine = "run-p"
var allWatchConnectLine = "run-p"

//#endregion

if(heads.length == 1) {
    packageJSON.scripts[connectScriptName] = getConnectLine(heads[0])
    packageJSON.scripts[watchConnectScriptName] = getWatchConnectLine(heads[0])
} else if(heads.length > 1) {
    heads.forEach(injectScripts)
    packageJSON.scripts[connectScriptName] = allConnectLine
    packageJSON.scripts[watchConnectScriptName] = allWatchConnectLine
}

//#region injectionFunctions
function injectScripts(head) {
    injectConnectScript(head)
    injectWatchConnectScript(head)
}

function injectConnectScript(head) {
    const scriptName = "connect-" + head + "-dom"
    packageJSON.scripts[scriptName] = getConnectLine(head)
    allConnectLine += " " + scriptName
}
function injectWatchConnectScript(head) {
    const scriptName = "watch-connect-" + head + "-dom"
    packageJSON.scripts[scriptName] = getWatchConnectLine(head)
    allWatchConnectLine += " " + scriptName
}

function getConnectLine(head) {
    const pugName = "document-head.pug"
    const resultName = head + "domconnect.coffee"
    const headPath = pathModule.resolve(headsPath, head, pugName)
    const resultPath = pathModule.resolve("sources/source/domconnect", resultName)
    const scriptLine = "implicit-dom-connect "+headPath+" '"+coffeeExpression+"' "+resultPath
    return scriptLine
}
function getWatchConnectLine(head) {
    const pugName = "document-head.pug"
    const resultName = head + "domconnect.coffee"
    const headPath = pathModule.resolve(headsPath, head, pugName)
    const resultPath = pathModule.resolve("sources/source/domconnect", resultName)
    const scriptLine = "implicit-dom-connect "+headPath+" '"+coffeeExpression+"' "+resultPath+" -w"
    return scriptLine
}
//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion