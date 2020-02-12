#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const htmlBase = pathModule.resolve(process.cwd(), "toolset/build/html/pretty")
const documentRoot = pathModule.resolve(process.cwd(), "testing/document-root")

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
var heads = fs.readdirSync(headsPath)

heads.forEach(linkHTML)

//#region linkerFunctions
function linkHTML(headName)  {
    const htmlName = headName + ".html"
    const realFilePath = pathModule.resolve(htmlBase, htmlName)
    const relativePath = pathModule.relative(documentRoot, realFilePath)
    const symlinkPath = pathModule.resolve(documentRoot, htmlName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}
//#endregion