#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

//#region pathDefinitions
const contentPath = pathModule.resolve(process.cwd(), "content")
    
const pugHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/pug/")
const pugOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/html/templatized-views/")

const headsPath = pathModule.resolve("sources/page-heads")

//#endregion 

//#region usedVariables
var heads = fs.readdirSync(headsPath)

noContent = true
languages = []

//#endregion

checkContent()
heads.forEach(generateTemplatizedViews)

//#region sideFunctions
function checkContent() {
    try {
        fs.accessSync(contentPath, fs.constants.R_OK)
        noContent = false
        languages = fs.readdirSync(contentPath).filter((option) => option.charAt(0) != "." )
        // console.log(languages)
    } catch (err) {
        // console.error('No Content');
    }
}

function generateTemplatizedViews(head) {
    const pugFileName = head+".pug"
    const pugHeadPath = pathModule.resolve(pugHeadsBasePath, pugFileName)

    const contentFileName = head+".json"
    const langDir = languages[0]
    const contentFilePath = pathModule.resolve(contentPath, langDir, contentFileName)

    const pageContent = require(contentFilePath)
    const topLevelKeys = Object.keys(pageContent)
    
    const mustacheObject = {}

    // console.log(JSON.stringify(topLevelKeys, null, 4))
    
    for(var i = 0; i < topLevelKeys.length; i++) {
        if(typeof pageContent[topLevelKeys[i]] == "string") {
            mustacheObject[topLevelKeys[i]] = "{{{"+topLevelKeys[i]+"}}}"
        } else {
            mustacheObject[topLevelKeys[i]] = createNextLevelObject(pageContent[topLevelKeys[i]])
            handleNextLevel(topLevelKeys[i], mustacheObject[topLevelKeys[i]], pageContent[topLevelKeys[i]])
        }
    }


    const outputFileName = head+"-mustache-keys.json"
    const outputFilePath = pathModule.resolve(pugOutputBasePath, outputFileName)
    const outputFileString = JSON.stringify(mustacheObject, null, 4) 
    fs.writeFile(outputFilePath, outputFileString, () => 0)

    // console.log(mustacheObject)
    // console.log(pugHeadPath)
    // console.log(contentFilePath)
    // console.log(outputFilePath)

}


function createNextLevelObject(pageContentObject) {
    if(Array.isArray(pageContentObject)){
        return []
    } else { return {} }
}

function handleNextLevel(prefix, mustacheObject, thisContent) {
    // console.log("prefix:" + prefix)
    // console.log("thisContent: \n" + JSON.stringify(thisContent, null, 4))
    const nextLevelKeys = Object.keys(thisContent)
    var nextPrefix = ""
    
    for(var i = 0; i < nextLevelKeys.length; i++) {

        //mustache needs the keys in this way xD
        nextPrefix = prefix+"."+nextLevelKeys[i]

        // if(Array.isArray(thisContent)) {
        //      nextPrefix = prefix+"["+nextLevelKeys[i]+"]"
        // } else {
        //     nextPrefix = prefix+"."+nextLevelKeys[i]
        // }

        if(typeof thisContent[nextLevelKeys[i]] == "string") {
            mustacheObject[nextLevelKeys[i]] = "{{{"+nextPrefix+"}}}"
        } else {
            mustacheObject[nextLevelKeys[i]] = createNextLevelObject(thisContent[nextLevelKeys[i]])
            handleNextLevel(nextPrefix, mustacheObject[nextLevelKeys[i]], thisContent[nextLevelKeys[i]])
        }
    }
}
//#endregion