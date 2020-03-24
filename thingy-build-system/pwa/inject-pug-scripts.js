#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}


const pugHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/pug/")
const pugOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty/")

const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

const pugBuildScriptName = "build-pug"
const pugWatchScriptName = "watch-pug"

var allPugBuildLine = "run-p"
var allPugWatchLine = "run-p"

//#endregion

if(heads.length == 1) {
    packageJSON.scripts[pugBuildScriptName] = getPugBuildLine(heads[0])
    packageJSON.scripts[pugWatchScriptName] = getPugWatchLine(heads[0])
} else if(heads.length > 1) {
    heads.forEach(injectScripts)
    packageJSON.scripts[pugBuildScriptName] = allPugBuildLine
    packageJSON.scripts[pugWatchScriptName] = allPugWatchLine
}

//#region injectionFunctions
function injectScripts(head) {
    injectBuildPugScript(head)
    injectWatchPugScript(head)
}

//#region lineInjectFunctions
function injectBuildPugScript(head) {
    const scriptName = "build-" + head + "-pug"
    packageJSON.scripts[scriptName] = getPugBuildLine(head)
    allPugBuildLine += " " + scriptName
}
function injectWatchPugScript(head) {
    const scriptName = "watch-" + head + "-pug"
    packageJSON.scripts[scriptName] = getPugWatchLine(head)
    allPugWatchLine += " " + scriptName
}

//#endregion

//#region getSpecificScriptLines
function getPugBuildLine(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const scriptLine = "pug "+headFilePath+" -o "+pugOutputBasePath+" --pretty" 
    return scriptLine
}
function getPugWatchLine(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const scriptLine = "pug -w "+headFilePath+" -o "+pugOutputBasePath+" --pretty" 
    return scriptLine
}

//#endregion

//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion

