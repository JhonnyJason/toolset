#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")


function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

function log(str) { console.log(str)}


const documentHeadTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/document-head-template.mustache")
const scriptsIncludeTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/scripts-include-template.mustache")
const stylesIncludeTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/styles-include-template.mustache")

const pugBodyTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/pug-body-template.mustache")
const stylusTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/stylus-template.mustache")
const coffeeTemplate = fs.readFileSync("toolset/thingy-build-system/pwa/coffee-template.mustache")


const mdFilesPath = "sources/ressources/md-content/"
const allFileNames = fs.readdirSync(mdFilesPath)
// console.log(allFiles)
const mdFileNames = allFileNames.filter((el) => el.endsWith(".md") )
// console.log(mdFileNames)
const newArticles = mdFileNames.map((el) => el.slice(0,-3))

// console.log(newArticles)
newArticles.forEach(createArticleFiles)







function createArticleFiles(fileName) {
    console.log("createArticleFiles for "+fileName )
    // create:
    
    // sources/page-heads/{{{name}}}/document-head.pug
    // sources/page-heads/{{{name}}}/scripts-include.pug
    // sources/page-heads/{{{name}}}/styles-include.pug

    // sources/source/{{{name}}}/{{{name}}}body.pug
    // sources/source/{{{name}}}/{{{name}}}.coffee
    // sources/source/{{{name}}}/{{{name}}}.styl
    

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
