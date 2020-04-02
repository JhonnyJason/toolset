#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const devBundlesBase = pathModule.resolve("toolset/build/bundles/dev")
const documentRoot = pathModule.resolve("testing/document-root")

var bundles = fs.readdirSync(devBundlesBase)

bundles.forEach(linkWorker)

//#region linkerFunctions
function linkWorker(bundleName)  {
    if(bundleName.indexOf("worker.js") == -1) return
    const realFilePath = pathModule.resolve(devBundlesBase, bundleName)
    const relativePath = pathModule.relative(documentRoot, realFilePath)
    const symlinkPath = pathModule.resolve(documentRoot, bundleName)
    try {fs.unlinkSync(symlinkPath)}catch(error){}
    fs.symlinkSync(relativePath, symlinkPath)    
}
//#endregion