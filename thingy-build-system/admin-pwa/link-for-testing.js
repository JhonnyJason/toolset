#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const dirtyCssBase = pathModule.resolve(process.cwd(), "toolset/build/css/admin-dirty")
const devBundlesBase = pathModule.resolve(process.cwd(), "toolset/build/bundles/dev")
const includesPath = pathModule.resolve(process.cwd(), "toolset/build/admin-includes")

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
var heads = fs.readdirSync(headsPath)

heads.forEach(linkDirtyCss)
heads.forEach(linkDevJs)

//#region linkerFunctions
function linkDirtyCss(headName)  {
    const cssName = headName + ".css"
    const realFilePath = pathModule.resolve(dirtyCssBase, cssName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, cssName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}

function linkDevJs(headName)  {
    const jsName = headName + ".js"
    const realFilePath = pathModule.resolve(devBundlesBase, jsName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, jsName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}
//#endregion