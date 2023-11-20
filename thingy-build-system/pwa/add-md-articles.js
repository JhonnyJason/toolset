#!/usr/bin/env node
const getPathDir = require("path").dirname
const fs = require("fs")
// const { error } = require("console")
const M = require("mustache")

// ##################################################
function olog(obj) { console.log(JSON.stringify(obj, null, 4)) }
function log(str) { console.log(str)}
function readUTF8(path) { return fs.readFileSync(path, "utf8") }


// ##################################################
const documentHeadTemplate = readUTF8("toolset/thingy-build-system/pwa/document-head-template.mustache")
const scriptsIncludeTemplate = readUTF8("toolset/thingy-build-system/pwa/scripts-include-template.mustache")
const stylesIncludeTemplate = readUTF8("toolset/thingy-build-system/pwa/styles-include-template.mustache")

const pugBodyTemplate = readUTF8("toolset/thingy-build-system/pwa/pug-body-template.mustache")
const stylusTemplate = readUTF8("toolset/thingy-build-system/pwa/stylus-template.mustache")
const coffeeTemplate = readUTF8("toolset/thingy-build-system/pwa/coffee-template.mustache")
const heroTemplate = readUTF8("toolset/thingy-build-system/pwa/hero-template.mustache")


// ##################################################
const mdFilesPath = "sources/ressources/md-content/"

const promoterS = "###### Meta Start ["
const terminatorS = "###### ] Meta End"
const prefix = "###### "


// ##################################################
// # Top Level Process
const allFileNames = fs.readdirSync(mdFilesPath)
// console.log(allFiles)
const mdFileNames = allFileNames.filter((el) => el.endsWith(".md") )
// console.log(mdFileNames)
const newArticles = mdFileNames.map((el) => el.slice(0,-3))
// console.log(newArticles)
newArticles.forEach(createArticleFiles)
log("Created all missing articleFiles! :-)")
// # Done :-)
// ##################################################


// ##################################################
function createArticleFiles(fileName) {
    log("createArticleFiles for "+fileName )

    // create:
    
    // sources/page-heads/{{{name}}}/document-head.pug
    // sources/page-heads/{{{name}}}/scripts-include.pug
    // sources/page-heads/{{{name}}}/styles-include.pug

    // sources/source/{{{name}}}/{{{name}}}body.pug
    // sources/source/{{{name}}}/{{{name}}}.coffee
    // sources/source/{{{name}}}/{{{name}}}.styl

    const documentHeadPath = "sources/page-heads/"+fileName+"/document-head.pug"
    const documentHeadDir = getPathDir(documentHeadPath)
    const scriptsIncludePath = "sources/page-heads/"+fileName+"/scripts-include.pug"
    const scriptsIncludeDir = getPathDir(scriptsIncludePath)
    const stylesIncludePath = "sources/page-heads/"+fileName+"/styles-include.pug"
    const stylesIncludeDir = getPathDir(stylesIncludePath)

    const pugBodyPath = "sources/source/"+fileName+"/"+fileName+"body.pug"
    const pugBodyDir = getPathDir(pugBodyPath)
    const coffeePath = "sources/source/"+fileName+"/"+fileName+".coffee"
    const coffeeDir = getPathDir(coffeePath)
    const stylusPath = "sources/source/"+fileName+"/"+fileName+".styl"
    const stylusDir = getPathDir(stylusPath)
    const heroPath = "sources/source/"+fileName+"/herosection.pug"
    const heroDir = getPathDir(heroPath)




    // Check if they already exist
    filesToCreate = {}

    if(!fs.existsSync(documentHeadPath)) 
        filesToCreate.documentHead = true     
    if(!fs.existsSync(scriptsIncludePath)) 
        filesToCreate.scriptsInclude = true 
    if(!fs.existsSync(stylesIncludePath)) 
        filesToCreate.stylesInclude = true 

    if(!fs.existsSync(pugBodyPath)) 
        filesToCreate.pugBody = true 
    if(!fs.existsSync(coffeePath)) 
        filesToCreate.coffee = true 
    if(!fs.existsSync(stylusPath)) 
        filesToCreate.stylus = true 
    if(!fs.existsSync(heroPath)) 
        filesToCreate.hero = true 


    // olog({filesToCreate})
    if(Object.keys(filesToCreate).length == 0)
        return

    try {
        const cObj = extractContentObject(fileName)
        // olog(cObj)

        if(filesToCreate.documentHead) {
            try { fs.mkdirSync(documentHeadDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(documentHeadPath, M.render(documentHeadTemplate, cObj))
        }
        if(filesToCreate.scriptsInclude) {
            try { fs.mkdirSync(scriptsIncludeDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(scriptsIncludePath, M.render(scriptsIncludeTemplate, cObj))
        }
        if(filesToCreate.stylesInclude) {
            try { fs.mkdirSync(stylesIncludeDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(stylesIncludePath, M.render(stylesIncludeTemplate, cObj))    
        }
 
        if(filesToCreate.pugBody) {
            try { fs.mkdirSync(pugBodyDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(pugBodyPath, M.render(pugBodyTemplate, cObj))
        }
        if(filesToCreate.coffee) {
            try { fs.mkdirSync(coffeeDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(coffeePath, M.render(coffeeTemplate, cObj))    
        }
        if(filesToCreate.stylus) {
            try { fs.mkdirSync(stylusDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(stylusPath, M.render(stylusTemplate, cObj))    
        }
        if(filesToCreate.hero) {
            try { fs.mkdirSync(heroDir, { recursive: true }); } catch(err) {}
            fs.writeFileSync(heroPath, M.render(heroTemplate, cObj))    
        }

    } catch(error) {
        log("warning: "+fileName+" skipped due to error on contentObject extraction... \n"+error.message)
        return
    }

    return
}


// <name>.md -> name
// html-title: htmlTitle
// html-description: htmlDecription
// html-keywords: -
// html-locale: htmlLocale, htmlLang
// page-uri: pageURI
// page-thumbnail: pageThumbnail 
// page-hero:
// blog-tags: 
    
function extractContentObject(fileName) {
    // log("extractContentObject for: "+fileName)

    const mdFilePath = mdFilesPath+fileName+".md"
    const mdFile = readUTF8(mdFilePath)
    const startPoint = mdFile.indexOf(promoterS) + promoterS.length
    const endPoint = mdFile.indexOf(terminatorS)

    if(startPoint < 0 || endPoint < 0)
        throw new Error("extractContentObject: Either no Promoter or no Terminator found in file!")

    const relevantS =  mdFile.slice(startPoint, endPoint)
    const relevantLines = relevantS.split(/\r?\n/)

    // olog(relevantLines)
    const parameters = relevantLines.map(extractParameter).filter((el) => el)

    // olog(parameters)
    // return

    const cObj = {}
    const num = parameters.length
    for(let i = 0; i < num; i++) {
        cObj[parameters[i][0]] = parameters[i][1] 
    }

    if(cObj.htmlLocale){
        cObj.htmlLang = cObj.htmlLocale.split("_")[0]
    }
    cObj.name = fileName
    // olog(cObj)
    return cObj
}

function extractParameter(line) {
    // log ("extractParameter from '"+line+"'")
    if(line.indexOf(prefix) != 0){ return }

    const colonPos = line.indexOf(":")
    if(colonPos < 0) {
        // throw new Error("extractParameter: no colon found!")
        log("warning: no colon found in line '"+line+"'")
        return
    }

    const key = camelize(line.slice(prefix.length, colonPos))
    const value = line.slice(colonPos +1).trim()

    // olog({key, value})
    return [key, value]
}

function camelize(str) {
    return str.replace(/-./g, x=>x[1].toUpperCase())
}