#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const purgedCssBase = pathModule.resolve("toolset/build/css/purged")
const deployBundlesBase = pathModule.resolve("toolset/build/bundles/deploy")
const includesPath = pathModule.resolve("toolset/build/includes")

const headsPath = pathModule.resolve("sources/page-heads")
var heads = fs.readdirSync(headsPath)

heads.forEach(linkPurgedCss)
heads.forEach(linkDeployJs)

//#region linkerFunctions
function linkPurgedCss(headName)  {
    const cssName = headName + ".css"
    const realFilePath = pathModule.resolve(purgedCssBase, cssName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, cssName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}

function linkDeployJs(headName)  {
    const jsName = headName + ".js"
    const realFilePath = pathModule.resolve(deployBundlesBase, jsName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, jsName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}
//#endregion
