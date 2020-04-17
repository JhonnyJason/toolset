#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

const headsPath = pathModule.resolve("sources/page-heads")
const pwaHeadsPath = pathModule.resolve("pwa-sources/page-heads")
const pwaSourcePath = pathModule.resolve("pwa-sources/source")
const adminPugHeadsPath = pathModule.resolve("toolset/build/heads/admin-pug")
const pwaPugHeadsPath = pathModule.resolve("toolset/build/heads/pwa-pug")

const stylusAdminHeadsPath = pathModule.resolve("toolset/build/heads/admin-styl")
const stylusPWAHeadsPath = pathModule.resolve("toolset/build/heads/pwa-styl")
const sourceHeadsPath = pathModule.resolve("sources/source")
const pwaSourceHeadsPath = pathModule.resolve("pwa-sources/source")

const pugHeadFileName = "document-head.pug"

var heads = fs.readdirSync(headsPath)
var pwaHeads = fs.readdirSync(pwaHeadsPath)

heads.forEach(writeAdminPugHeadFile)
heads.forEach(writeAdminStylusHeadFile)
pwaHeads.forEach(writePWAStylusHeadFile)
pwaHeads.forEach(writePWAPugHeadFile)

function writeAdminPugHeadFile(headName)  {
    const headPath = pathModule.resolve(headsPath, headName, pugHeadFileName)
    const headsPugHeadFileName = headName + ".pug"
    const headsHeadPath = pathModule.resolve(adminPugHeadsPath, headsPugHeadFileName)
    const relativePath = pathModule.relative(adminPugHeadsPath, headPath)
    const includeString = "include " + relativePath
    fs.writeFileSync(headsHeadPath, includeString)
}

function writePWAPugHeadFile(headName)  {
    const pugBodyFileName = headName+"body.pug"
    const bodyPath = pathModule.resolve(pwaSourcePath, headName, pugBodyFileName)
    const headsHeadPath = pathModule.resolve(pwaPugHeadsPath, pugBodyFileName)
    const relativePath = pathModule.relative(pwaPugHeadsPath, bodyPath)
    const includeString = "include " + relativePath
    fs.writeFileSync(headsHeadPath, includeString)
}

function writeAdminStylusHeadFile(headName) {
    const stylusHeadFileName = headName + ".styl"
    const headPath = pathModule.resolve(sourceHeadsPath, headName, stylusHeadFileName)
    const headsStylusHeadFileName = headName + ".styl"
    const headsHeadPath = pathModule.resolve(stylusAdminHeadsPath, headsStylusHeadFileName)
    const relativePath = pathModule.relative(stylusAdminHeadsPath, headPath)
    const includeString = "@import '" + relativePath + "'"
    fs.writeFileSync(headsHeadPath, includeString)
}

function writePWAStylusHeadFile(headName) {
    const stylusHeadFileName = headName + ".styl"
    const headPath = pathModule.resolve(pwaSourceHeadsPath, headName, stylusHeadFileName)
    const headsStylusHeadFileName = headName + ".styl"
    const headsHeadPath = pathModule.resolve(stylusPWAHeadsPath, headsStylusHeadFileName)
    const relativePath = pathModule.relative(stylusPWAHeadsPath, headPath)
    const includeString = "@import '" + relativePath + "'"
    fs.writeFileSync(headsHeadPath, includeString)
}