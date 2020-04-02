#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}


const stylusHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/styl/")
const stylusOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/css/dirty/")

const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

const stylusBuildScriptName = "build-style"
const stylusWatchScriptName = "watch-style"

var allStylusBuildLine = "run-p"
var allStylusWatchLine = "run-p"

//#endregion

if(heads.length == 1) {
    packageJSON.scripts[stylusBuildScriptName] = getStylusBuildLine(heads[0])
    packageJSON.scripts[stylusWatchScriptName] = getStylusWatchLine(heads[0])
} else if(heads.length > 1) {
    heads.forEach(injectScripts)
    packageJSON.scripts[stylusBuildScriptName] = allStylusBuildLine
    packageJSON.scripts[stylusWatchScriptName] = allStylusWatchLine
}

//#region injectionFunctions
function injectScripts(head) {
    injectBuildStyleScript(head)
    injectWatchStyleScript(head)
}

//#region lineInjectFunctions
function injectBuildStyleScript(head) {
    const scriptName = "build-" + head + "-style"
    packageJSON.scripts[scriptName] = getStylusBuildLine(head)
    allStylusBuildLine += " " + scriptName
}
function injectWatchStyleScript(head) {
    const scriptName = "watch-" + head + "-style"
    packageJSON.scripts[scriptName] = getStylusWatchLine(head)
    allStylusWatchLine += " " + scriptName
}

//#endregion

//#region getSpecificScriptLines
function getStylusBuildLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusHeadsBasePath, headFileName)
    const scriptLine = "stylus "+headFilePath+" -o "+stylusOutputBasePath+" --include-css" 
    return scriptLine
}
function getStylusWatchLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusHeadsBasePath, headFileName)
    const scriptLine = "stylus -w "+headFilePath+" -o "+stylusOutputBasePath+" --include-css" 
    return scriptLine
}

//#endregion

//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion

