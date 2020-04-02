#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const dirtyCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/dirty")
const cleanCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/clean")
const purgedCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/purged")


const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")


//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

const cleanScriptName = "clean-css"
const purgeScriptName = "purge-css"

var allCleaningLine = "run-p"
var allPurgingLine = "run-p"

//#endregion

if(heads.length == 1) {
    packageJSON.scripts[cleanScriptName] = getCleanCSSLine(heads[0])
    packageJSON.scripts[purgeScriptName] = getPurgeCSSLine(heads[0])    
} else if(heads.length > 1) {
    heads.forEach(injectScripts)
    packageJSON.scripts[cleanScriptName] = allCleaningLine
    packageJSON.scripts[purgeScriptName] = allPurgingLine    
}

//#region injectionFunctions
function injectScripts(head) {
    injectCleanCSSScript(head)
    injectPurgeCSSScript(head)
}

function injectCleanCSSScript(head) {
    const scriptName = "clean-" + head + "-css"
    packageJSON.scripts[scriptName] = getCleanCSSLine(head)
    allCleaningLine += " " + scriptName
}
function injectPurgeCSSScript(head) {
    const scriptName = "purge-" + head + "-css"
    packageJSON.scripts[scriptName] = getPurgeCSSLine(head)
    allPurgingLine += " " + scriptName
}

function getCleanCSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(dirtyCSSPath, cssName)
    const destPath = pathModule.resolve(cleanCSSPath, cssName)
    const scriptLine = "cleancss -O2 'specialComments:0' " + sourcePath +  " --output " + destPath 
    return scriptLine
}
function getPurgeCSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(cleanCSSPath, cssName)
    const htmlName = head + ".html"
    const contentPath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty", htmlName)
    const scriptLine = "purgecss --css " + sourcePath + " --content " + contentPath + " --output " + purgedCSSPath 
    return scriptLine
}
//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion