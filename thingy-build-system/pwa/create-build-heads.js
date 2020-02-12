#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const headsPath = pathModule.resolve("sources/page-heads")
const pugHeadsPath = pathModule.resolve("toolset/build/heads/pug")
const stylusHeadsPath = pathModule.resolve("toolset/build/heads/styl")
const sourceHeadsPath = pathModule.resolve("sources/source")

const pugHeadFileName = "document-head.pug"

var heads = fs.readdirSync(headsPath)

heads.forEach(writePugHeadFile)
heads.forEach(writeStylusHeadFile)

function writePugHeadFile(headName)  {
    const headPath = pathModule.resolve(headsPath, headName, pugHeadFileName)
    const headsPugHeadFileName = headName + ".pug"
    const headsHeadPath = pathModule.resolve(pugHeadsPath, headsPugHeadFileName)
    const relativePath = pathModule.relative(pugHeadsPath, headPath)
    const includeString = "include " + relativePath
    fs.writeFileSync(headsHeadPath, includeString)
}

function writeStylusHeadFile(headName) {
    const stylusHeadFileName = headName + ".styl"
    const headPath = pathModule.resolve(sourceHeadsPath, headName, stylusHeadFileName)
    const headsStylusHeadFileName = headName + ".styl"
    const headsHeadPath = pathModule.resolve(stylusHeadsPath, headsStylusHeadFileName)
    const relativePath = pathModule.relative(stylusHeadsPath, headPath)
    const includeString = "@import '" + relativePath + "'"
    fs.writeFileSync(headsHeadPath, includeString)
}