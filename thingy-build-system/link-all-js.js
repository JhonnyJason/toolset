#!/usr/bin/env node

//############################################################
// const { resolve, parse, relative }  = require('path')
// const { readdirSync, unlinkSync, symlinkSync } = require('fs')
const p  = require('path')
const f = require('fs')

//############################################################
const jsPath = "toolset/build/js/"
const sourcePath = "sources/source"

const allJSFiles = []

//############################################################
// find all js files in source dir
// 1. list all subdirectories of source dir
const allDirectoryNames = getDirectoryNames(sourcePath)
// 2.check each subdirectory for js files
allDirectoryNames.forEach(checkForJS)

//############################################################
// create symlinks for allJSFiles
allJSFiles.forEach(createSymlink)

//############################################################
// helper functions
function getDirectoryNames(source) {
    allNodes = f.readdirSync(source, { withFileTypes: true })
    dirNames = allNodes.filter(el => el.isDirectory()).map(el => el.name)
    return dirNames
}

function getJSNames(source) {
    allNodes = f.readdirSync(source, { withFileTypes: true })
    jsNames = allNodes.filter(el => el.name.endsWith(".js") ).map(el => el.name)
    return jsNames
}

function checkForJS(dirName) {
    basePath = p.resolve(sourcePath, dirName)
    jsNames = getJSNames(basePath)
    jsNames.forEach((name) => allJSFiles.push(p.resolve(basePath, name)))
}

function createSymlink(jsFilePath) {
    const jsFileName = p.parse(jsFilePath).base
    const relativePath = p.relative(jsPath, jsFilePath)
    const symlinkPath = p.resolve(jsPath, jsFileName)

    try { f.unlinkSync(symlinkPath) } catch(error) {}
    f.symlinkSync(relativePath, symlinkPath)    
}