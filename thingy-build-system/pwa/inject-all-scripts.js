#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const coffeeExpression = "sources/source/*/*.coffee"

//#region pathDefinitions
const configBasePath = pathModule.resolve(process.cwd(), ".build-config/")

const contentPath = pathModule.resolve(process.cwd(), "content")
    
const pugHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/pug/")
const pugOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty/")

const stylusHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/styl/")
const stylusOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/css/dirty/")

const dirtyCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/dirty")
const cleanCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/clean")
const purgedCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/purged")

const jsPath = pathModule.resolve(process.cwd(), "toolset/build/js")

const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")

//#endregion 

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var packageJSON = require(packageJSONPath)

var language = packageJSON.lang
noWorkers = true
noContent = true
languages = []

//#region scriptNames
const devBundleScriptName = "dev-bundle"
// const devWorkerBundleScriptName = "dev-worker-bundle"
const watchBundleScriptName = "watch-bundle"
// const watchWorkerBundleScriptName = "watch-worker-bundle"

const pugBuildScriptName = "build-pug"
const pugWatchScriptName = "watch-pug"

const stylusBuildScriptName = "build-style"
const stylusWatchScriptName = "watch-style"

const connectScriptName = "connect-dom"
const watchConnectScriptName = "watch-connect-dom"

const cleanScriptName = "clean-css"
const purgeScriptName = "purge-css"

//#endregion

//#region lineOfAll
var allDevBundleLine = "run-p"
var allWatchBundleLine = "run-p"

var allPugBuildLine = "run-p"
var allPugWatchLine = "run-p"

var allStylusBuildLine = "run-p"
var allStylusWatchLine = "run-p"

var allConnectLine = "run-p"
var allWatchConnectLine = "run-p"

var allCleaningLine = "run-p"
var allPurgingLine = "run-p"

//#endregion

//#endregion

// checkWorkers()
checkContent()
if(!noContent) {
    if(!language) {
        language = languages[0]
    }
}

if(heads.length == 1) {
    injectTestScripts(heads[0])
    
    packageJSON.scripts[devBundleScriptName] = getDevBundleLine(heads[0])    
    packageJSON.scripts[watchBundleScriptName] = getWatchBundleLine(heads[0])

    if(noContent) {
        packageJSON.scripts[pugBuildScriptName] = getPugBuildLineNoContent(heads[0])
        packageJSON.scripts[pugWatchScriptName] = getPugWatchLineNoContent(heads[0])    
    } else {
        packageJSON.scripts[pugBuildScriptName] = getPugBuildLineWithContent(heads[0], language)
        packageJSON.scripts[pugWatchScriptName] = getPugWatchLineWithContent(heads[0], language)    
    }

    packageJSON.scripts[stylusBuildScriptName] = getStylusBuildLine(heads[0])
    packageJSON.scripts[stylusWatchScriptName] = getStylusWatchLine(heads[0])

    packageJSON.scripts[connectScriptName] = getConnectLine(heads[0])
    packageJSON.scripts[watchConnectScriptName] = getWatchConnectLine(heads[0])

    packageJSON.scripts[cleanScriptName] = getCleanCSSLine(heads[0])
    packageJSON.scripts[purgeScriptName] = getPurgeCSSLine(heads[0])    

} else if(heads.length > 1) {
    heads.forEach(injectScripts)

    packageJSON.scripts[devBundleScriptName] = allDevBundleLine
    packageJSON.scripts[watchBundleScriptName] = allWatchBundleLine

    packageJSON.scripts[pugBuildScriptName] = allPugBuildLine
    packageJSON.scripts[pugWatchScriptName] = allPugWatchLine

    packageJSON.scripts[stylusBuildScriptName] = allStylusBuildLine
    packageJSON.scripts[stylusWatchScriptName] = allStylusWatchLine

    packageJSON.scripts[connectScriptName] = allConnectLine
    packageJSON.scripts[watchConnectScriptName] = allWatchConnectLine

    packageJSON.scripts[cleanScriptName] = allCleaningLine
    packageJSON.scripts[purgeScriptName] = allPurgingLine    

}

//#region handleWorkerBundles
// probably we donot need to bundle the workers separatedly
// this means all this could go away ;-)

// packageJSON.scripts[watchWorkerBundleScriptName] = "echo 'no worker support yet!'"    
// packageJSON.scripts[devWorkerBundleScriptName] = "echo 'no worker support yet!'"

// if(noWorkers) {
//     packageJSON.scripts[devWorkerBundleScriptName] = "echo 'no workers'"
//     packageJSON.scripts[watchWorkerBundleScriptName] = "echo 'no workers'"
//     //for deploy-worker-bundle script
//     packageJSON.scripts["deploy-worker-bundle"] = "echo 'no workers'"

// } else {
//     packageJSON.scripts[devWorkerBundleScriptName] = getDevWorkerBundleLine(heads[0])
//     packageJSON.scripts[watchWorkerBundleScriptName] = getWatchWorkerBundleLine(heads[0])
//     //for deploy-worker-bundle script
//     packageJSON.scripts["deploy-worker-bundle"] = "webpack-cli --config "+webpackDeployWorkerConfig
// }

// if(noWorkers) {
//     packageJSON.scripts[devWorkerBundleScriptName] = "echo 'no workers'"
//     packageJSON.scripts[watchWorkerBundleScriptName] = "echo 'no workers'"
//     //for deploy script
//     packageJSON.scripts["deploy-bundle"] = "echo 'no workers'"
    
// } else {
//     packageJSON.scripts[devWorkerBundleScriptName] = allDevWorkerBundleLine
//     packageJSON.scripts[watchWorkerBundleScriptName] = allWatchWorkerBundleLine
//     //for deploy script
//     packageJSON.scripts["deploy-bundle"] = "echo 'workers deploy bundle!'"
// }

//#endregion

// function checkWorkers() {
//     const jss = fs.readdirSync(jsPath)
//     var entries = {}
//     for(var i = 0; i < jss.length; i++) {
//         if(jss[i].endsWith("worker.js")) {
//             noWorkers = false
//             return
//         }
//     }
// }

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

//#region injectionFunctions
function injectScripts(head) {
    injectTestScripts(head)

    injectDevBundleScript(head)
    injectWatchBundleScript(head)

    injectBuildPugScript(head)
    injectWatchPugScript(head)

    injectBuildStyleScript(head)
    injectWatchStyleScript(head)

    injectConnectScript(head)
    injectWatchConnectScript(head)

    injectCleanCSSScript(head)
    injectPurgeCSSScript(head)

}

function injectTestScripts(head) {
    const scriptName = head + "-test"
    packageJSON.scripts[scriptName] = getTestLine(head)
}

//#region lineInjectFunctions
function injectDevBundleScript(head) {
    const scriptName = "dev-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getDevBundleLine(head)
    allDevBundleLine += " " + scriptName
}
// function injectDevWorkerBundleScript(head) {
//     const scriptName = "dev-worker-" + head + "-bundle"
//     packageJSON.scripts[scriptName] = getDevWorkerBundleLine(head)
//     allDevWorkerBundleLine += " " + scriptName
// }
function injectWatchBundleScript(head) {
    const scriptName = "watch-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getWatchBundleLine(head)
    allWatchBundleLine += " " + scriptName
}
// function injectWatchWorkerBundleScript(head) {
//     const scriptName = "watch-worker-" + head + "-bundle"
//     packageJSON.scripts[scriptName] = getWatchWorkerBundleLine(head)
//     allWatchWorkerBundleLine += " " + scriptName
// }

function injectBuildPugScript(head) {
    if(noContent) {
        injectBuildPugScriptsNoContent(head)
    } else {
        injectBuildPugScriptsWithContent(head)
    }
}
function injectWatchPugScript(head) {
    if(noContent) {
        injectWatchPugScriptsNoContent(head)
    } else {
        injectWatchPugScriptsWithContent(head)
    }
}
function injectBuildPugScriptsWithContent(head) {
    const scriptName = "build-"+head+"-"+language+"-pug"
    packageJSON.scripts[scriptName] = getPugBuildLineWithContent(head, language)
    allPugBuildLine += " " + scriptName    

    //for now we only build one language
    // for(var i = 0; i < languages.length; i++) {
    //     let scriptName = "build-"+head+"-"+languages[i]+"-pug"
    //     packageJSON.scripts[scriptName] = getPugBuildLineWithContent(head, languages[i])
    //     allPugBuildLine += " " + scriptName    
    // }
}
function injectWatchPugScriptsWithContent(head) {

    const scriptName = "watch-"+head+"-"+language+"-pug"
    packageJSON.scripts[scriptName] = getPugWatchLineWithContent(head, language)
    allPugWatchLine += " " + scriptName    
    
    //watching is for development only - so we donot need all languages
    // for(var i = 0; i < languages.length; i++) {
    //     let scriptName = "watch-"+head+"-"+languages[i]+"-pug"
    //     packageJSON.scripts[scriptName] = getPugWatchLineWithContent(head, languages[i])
    //     allPugWatchLine += " " + scriptName    
    // }
}
function injectBuildPugScriptsNoContent(head) {
    const scriptName = "build-" + head + "-pug"
    packageJSON.scripts[scriptName] = getPugBuildLineNoContent(head)
    allPugBuildLine += " " + scriptName
}
function injectWatchPugScriptsNoContent(head) {
    const scriptName = "watch-" + head + "-pug"
    packageJSON.scripts[scriptName] = getPugWatchLineNoContent(head)
    allPugWatchLine += " " + scriptName
}


function injectBuildStyleScript(head) {
    const scriptName = "build-" + head + "-style"
    packageJSON.scripts[scriptName] = getStylusBuildLine(head)
    allStylusBuildLine += " " + scriptName
}
function injectWatchStyleScript(head) {
    const scriptName = "watch-" + head + "-style"
    packageJSON.scripts[scriptName] = getStylusWatchLine(head)
    allStylusWatchLine += " " + scriptName
}

function injectConnectScript(head) {
    const scriptName = "connect-" + head + "-dom"
    packageJSON.scripts[scriptName] = getConnectLine(head)
    allConnectLine += " " + scriptName
}
function injectWatchConnectScript(head) {
    const scriptName = "watch-connect-" + head + "-dom"
    packageJSON.scripts[scriptName] = getWatchConnectLine(head)
    allWatchConnectLine += " " + scriptName
}

function injectCleanCSSScript(head) {
    const scriptName = "clean-" + head + "-css"
    packageJSON.scripts[scriptName] = getCleanCSSLine(head)
    allCleaningLine += " " + scriptName
}
function injectPurgeCSSScript(head) {
    const scriptName = "purge-" + head + "-css"
    packageJSON.scripts[scriptName] = getPurgeCSSLine(head)
    allPurgingLine += " " + scriptName
}

//#endregion

//#region getSpecificScriptLines
function getTestLine(head) {
    line = "run-p"
    line += " watch-connect-" + head + "-dom"
    line += " watch-coffee"
    line += " watch-worker-bundle"
    line += " watch-" + head + "-bundle"
    line += " watch-" + head + "-style"
    if(noContent) {
        line += " watch-" + head + "-pug"
    } else {
        line += " watch-"+head+"-"+language+"-pug"
    }
    line += " expose"
    return line
}

function getDevBundleLine(head) {
    const configFileName = "webpack-dev-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
// function getDevWorkerBundleLine(head) {
//     const configFileName = "webpack-dev-worker-"+head+".config.js"
//     const configFilePath = pathModule.resolve(configBasePath, configFileName)
//     const scriptLine = "webpack-cli --config "+configFilePath 
//     return scriptLine
// }
function getWatchBundleLine(head) {
    const configFileName = "webpack-watch-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
// function getWatchWorkerBundleLine(head) {
//     const configFileName = "webpack-watch-worker-"+head+".config.js"
//     const configFilePath = pathModule.resolve(configBasePath, configFileName)
//     const scriptLine = "webpack-cli --config "+configFilePath 
//     return scriptLine
// }

function getPugBuildLineWithContent(head, langTag) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const contentFileName = head+".json"
    const contentFilePath = pathModule.resolve(contentPath, langTag, contentFileName)
    const scriptLine = "pug "+headFilePath+" -o "+pugOutputBasePath+" --pretty --obj "+contentFilePath 
    return scriptLine
}
function getPugWatchLineWithContent(head, langTag) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const contentFileName = head+".json"
    const contentFilePath = pathModule.resolve(contentPath, langTag, contentFileName)
    const scriptLine = "pug -w "+headFilePath+" -o "+pugOutputBasePath+" --pretty --obj "+contentFilePath 
    return scriptLine
}
function getPugBuildLineNoContent(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const scriptLine = "pug "+headFilePath+" -o "+pugOutputBasePath+" --pretty" 
    return scriptLine
}
function getPugWatchLineNoContent(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(pugHeadsBasePath, headFileName)
    const scriptLine = "pug -w "+headFilePath+" -o "+pugOutputBasePath+" --pretty" 
    return scriptLine
}

function getStylusBuildLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusHeadsBasePath, headFileName)
    const scriptLine = "stylus "+headFilePath+" -o "+stylusOutputBasePath+" --include-css" 
    return scriptLine
}
function getStylusWatchLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusHeadsBasePath, headFileName)
    const scriptLine = "stylus -w "+headFilePath+" -o "+stylusOutputBasePath+" --include-css" 
    return scriptLine
}

function getConnectLine(head) {
    const pugName = "document-head.pug"
    const resultName = head + "domconnect.coffee"
    const headPath = pathModule.resolve(headsPath, head, pugName)
    const resultPath = pathModule.resolve("sources/source/domconnect", resultName)
    const scriptLine = "implicit-dom-connect "+headPath+" '"+coffeeExpression+"' "+resultPath
    return scriptLine
}
function getWatchConnectLine(head) {
    const pugName = "document-head.pug"
    const resultName = head + "domconnect.coffee"
    const headPath = pathModule.resolve(headsPath, head, pugName)
    const resultPath = pathModule.resolve("sources/source/domconnect", resultName)
    const scriptLine = "implicit-dom-connect "+headPath+" '"+coffeeExpression+"' "+resultPath+" -w"
    return scriptLine
}

function getCleanCSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(dirtyCSSPath, cssName)
    const destPath = pathModule.resolve(cleanCSSPath, cssName)
    const scriptLine = "cleancss -O2 'specialComments:0' " + sourcePath +  " --output " + destPath 
    return scriptLine
}
function getPurgeCSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(cleanCSSPath, cssName)
    const htmlName = head + ".html"
    const contentPath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty", htmlName)
    const scriptLine = "purgecss --css " + sourcePath + " --content " + contentPath + " --output " + purgedCSSPath 
    return scriptLine
}

//#endregion

//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion