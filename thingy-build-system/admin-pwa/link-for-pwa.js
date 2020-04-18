#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const purgedCssBase = pathModule.resolve("toolset/build/css/pwa-clean")
const pwaBundlesBase = pathModule.resolve("toolset/build/bundles/pwa")
const includesPath = pathModule.resolve("toolset/build/pwa-includes")
const pwaIncludesPath = pathModule.resolve("toolset/build/includes")
const pwaContentBase = pathModule.resolve("pwa-content")
const jsBase = pathModule.resolve("toolset/build/js")


const headsPath = pathModule.resolve("pwa-sources/page-heads")
var heads = fs.readdirSync(headsPath)
var languages = fs.readdirSync(pwaContentBase).filter((file) => file.charAt(0) != ".")

heads.forEach(linkPurgedCss)
heads.forEach(linkPWAJs)
heads.forEach(linkPWAContent)


const relativePath = pathModule.resolve(pwaIncludesPath, includesPath)
const symlinkPath = pathModule.resolve(process.cwd(), pwaIncludesPath)
try {fs.unlinkSync(symlinkPath)}catch(error){}
fs.symlinkSync(relativePath, symlinkPath)    

//#region linkerFunctions
function linkPurgedCss(headName)  {
    const cssName = headName + ".css"
    const realFilePath = pathModule.resolve(purgedCssBase, cssName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, cssName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}

function linkPWAJs(headName)  {
    const jsName = headName + ".js"
    const realFilePath = pathModule.resolve(pwaBundlesBase, jsName)
    const relativePath = pathModule.relative(includesPath, realFilePath)
    const symlinkPath = pathModule.resolve(includesPath, jsName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}

function linkPWAContent(headName)  {
    const jsonName = headName + ".json"
    const realFilePath = pathModule.resolve(pwaContentBase, languages[0], jsonName)
    const relativePath = pathModule.relative(jsBase, realFilePath)
    const linkName = headName+"-pwa-content.json"
    const symlinkPath = pathModule.resolve(jsBase, linkName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}
//#endregion
