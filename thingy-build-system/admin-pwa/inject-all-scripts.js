#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const coffeeExpression = "sources/source/*/*.coffee"

//#region pathDefinitions
const configBasePath = pathModule.resolve(process.cwd(), ".build-config/")

const adminContentPath = pathModule.resolve(process.cwd(), "content")
const pwaContentPath = pathModule.resolve(process.cwd(), "pwa-content")
    
const adminPugHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/heads/admin-pug/")
const adminPugOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty/")
const pwaPugHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/heads/pwa-pug/")
const pwaPugOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/js/")


const stylusAdminHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/admin-styl/")
const stylusAdminOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/css/admin-dirty/")
const stylusPWAHeadsBasePath = pathModule.resolve(process.cwd(), "toolset/build/heads/pwa-styl/")
const stylusPWAOutputBasePath = pathModule.resolve(process.cwd(), "toolset/build/css/pwa-dirty/")

const dirtyAdminCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/admin-dirty")
const cleanAdminCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/admin-clean")
const purgedAdminCSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/admin-purged")
const dirtyPWACSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/pwa-dirty")
const cleanPWACSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/pwa-clean")
const purgedPWACSSPath = pathModule.resolve(process.cwd(), "toolset/build/css/pwa-purged")

const jsPath = pathModule.resolve(process.cwd(), "toolset/build/js")

const webpackDeployWorkerConfig = ".build-config/webpack-deploy-worker.config.js"


const packageJSONPath = pathModule.resolve(process.cwd(), "package.json") 
const headsPath = pathModule.resolve("sources/page-heads")
const pwaHeadsPath = pathModule.resolve("pwa-sources/page-heads")

//#endregion 

//#region usedVariables
var heads = fs.readdirSync(headsPath)
var pwaHeads = fs.readdirSync(pwaHeadsPath)
var packageJSON = require(packageJSONPath)

var noWorkers = true
var noContent = true
var languages = []
var pwaLanguages = []

//#region scriptNames
const devBundleScriptName = "dev-bundle"
const devWorkerBundleScriptName = "dev-worker-bundle"
const watchBundleScriptName = "watch-bundle"
const watchWorkerBundleScriptName = "watch-worker-bundle"
const deployWorkerBundleScriptName = "deploy-worker-bundle"

const pugBuildScriptName = "build-pug"
const pugWatchScriptName = "watch-pug"
const pugPWABuildScriptName = "build-pwa-pug"

const stylusBuildScriptName = "build-style"
const stylusWatchScriptName = "watch-style"

const stylusPWABuildScriptName = "build-pwa-style"

const connectScriptName = "connect-dom"
const watchConnectScriptName = "watch-connect-dom"

const cleanScriptName = "clean-css"
const purgeScriptName = "purge-css"

const cleanPWAScriptName = "clean-pwa-css"
const purgePWAScriptName = "purge-pwa-css"

//#endregion

//#region lineOfAll
var allDevBundleLine = "run-p"
var allDevWorkerBundleLine = "run-p"
var allWatchBundleLine = "run-p"
var allWatchWorkerBundleLine = "run-p"

var allPugBuildLine = "run-p"
var allPugWatchLine = "run-p"
var allPugPWABuildLine = "run-p"

var allStylusBuildLine = "run-p"
var allStylusWatchLine = "run-p"
var allStylusPWABuildLine = "run-p"

var allConnectLine = "run-p"
var allWatchConnectLine = "run-p"

var allCleaningLine = "run-p"
var allPurgingLine = "run-p"
var allPWACleaningLine = "run-p"
var allPWAPurgingLine = "run-p"
//#endregion

//#endregion

// checkWorkers()
checkContent()

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

    // packageJSON.scripts[devBundleScriptName] = allDevBundleLine
    // packageJSON.scripts[watchBundleScriptName] = allWatchBundleLine
    if(noContent) {
        packageJSON.scripts[pugBuildScriptName] = getPugBuildLineNoContent("index")
        packageJSON.scripts[pugWatchScriptName] = getPugWatchLineNoContent("index")    
    } else {
        packageJSON.scripts[pugBuildScriptName] = getPugBuildLineWithContent("index", language)
        packageJSON.scripts[pugWatchScriptName] = getPugWatchLineWithContent("index", language)    
    }

    packageJSON.scripts[pugBuildScriptName] = allPugBuildLine
    packageJSON.scripts[pugWatchScriptName] = allPugWatchLine

    // packageJSON.scripts[stylusBuildScriptName] = allStylusBuildLine
    // packageJSON.scripts[stylusWatchScriptName] = allStylusWatchLine
    packageJSON.scripts[stylusBuildScriptName] = getStylusBuildLine("index")
    packageJSON.scripts[stylusWatchScriptName] = getStylusWatchLine("index")

    // packageJSON.scripts[connectScriptName] = allConnectLine
    // packageJSON.scripts[watchConnectScriptName] = allWatchConnectLine
    packageJSON.scripts[connectScriptName] = getConnectLine("index")
    packageJSON.scripts[watchConnectScriptName] = getWatchConnectLine("index")

    // packageJSON.scripts[cleanScriptName] = allCleaningLine
    // packageJSON.scripts[purgeScriptName] = allPurgingLine    
    packageJSON.scripts[cleanScriptName] = getCleanCSSLine("index")
    packageJSON.scripts[purgeScriptName] = getPurgeCSSLine("index")    

}


if(pwaHeads.length == 1) {
    packageJSON.scripts[stylusPWABuildScriptName] = getStylusPWABuildLine(pwaHeads[0])

    packageJSON.scripts[cleanPWAScriptName] = getCleanPWACSSLine(pwaHeads[0])
    packageJSON.scripts[purgePWAScriptName] = getPurgePWACSSLine(pwaHeads[0])    

    packageJSON.scripts[pugPWABuildScriptName] = getPugPWABuildLineWithContent(pwaHeads[0], language)

} else if(pwaHeads.length > 1) {
    pwaHeads.forEach(injectPWAScripts)

    packageJSON.scripts[stylusPWABuildScriptName] = allStylusPWABuildLine
    
    packageJSON.scripts[cleanPWAScriptName] = allPWACleaningLine
    packageJSON.scripts[purgePWAScriptName] = allPWAPurgingLine    

    packageJSON.scripts[pugPWABuildScriptName] = allPugPWABuildLine

}


//#region handleWorkerBundles
//TODO handle worker bundles somehow...
packageJSON.scripts[watchWorkerBundleScriptName] = "echo 'no worker support yet!'"    
packageJSON.scripts[devWorkerBundleScriptName] = "echo 'no worker support yet!'"
packageJSON.scripts[deployWorkerBundleScriptName] = "echo 'no worker support yet!'"

// injectDevWorkerBunldeScript(head)
// injectWatchWorkerBundleScript(head)

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

function checkWorkers() {
    const jss = fs.readdirSync(jsPath)
    var entries = {}
    for(var i = 0; i < jss.length; i++) {
        if(jss[i].endsWith("worker.js")) {
            noWorkers = false
            return
        }
    }
}

function checkContent() {
    try {
        fs.accessSync(adminContentPath, fs.constants.R_OK)
        noContent = false
        if()
        languages = fs.readdirSync(adminContentPath).filter((option) => option.charAt(0) != "." )

        if (typeof packageJSON.lang == "string") {
            language = packageJSON.lang
        } else {
            language = languages[0]
        }
        // console.log(language)
    } catch (err) {
        // console.error('No Content');
    }
    try {
        fs.accessSync(pwaContentPath, fs.constants.R_OK)
        noContent = false
        pwaLanguages = fs.readdirSync(pwaContentPath).filter((option) => option.charAt(0) != "." )
    
        if (typeof packageJSON.lang == "string") {
            language = packageJSON.lang
        } else {
            language = pwaLanguages[0]
        }
        // console.log(language)
    } catch (err) {
        // console.error('No Content');
    }

}

//#region injectionFunctions
function injectScripts(head) {
    injectTestScripts(head)

    // injectDevBundleScript(head)
    // injectWatchBundleScript(head)

    injectBuildPugScript(head)
    injectWatchPugScript(head)

    // injectBuildStyleScript(head)
    // injectWatchStyleScript(head)

    // injectConnectScript(head)
    // injectWatchConnectScript(head)

    // injectCleanCSSScript(head)
    // injectPurgeCSSScript(head)

}

function injectPWAScripts(head) {

    injectBuildPWAStyleScript(head)

    injectCleanPWACSSScript(head)
    injectPurgePWACSSScript(head)

    injectBuildPWAPugScriptsWithContent(head)
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
function injectDevWorkerBundleScript(head) {
    const scriptName = "dev-worker-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getDevWorkerBundleLine(head)
    allDevWorkerBundleLine += " " + scriptName
}
function injectWatchBundleScript(head) {
    const scriptName = "watch-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getWatchBundleLine(head)
    allWatchBundleLine += " " + scriptName
}
function injectWatchWorkerBundleScript(head) {
    const scriptName = "watch-worker-" + head + "-bundle"
    packageJSON.scripts[scriptName] = getWatchWorkerBundleLine(head)
    allWatchWorkerBundleLine += " " + scriptName
}

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
}

function injectWatchPugScriptsWithContent(head) {
    const scriptName = "watch-"+head+"-"+language+"-pug"
    packageJSON.scripts[scriptName] = getPugWatchLineWithContent(head, language)
    allPugWatchLine += " " + scriptName        
}

function injectBuildPWAPugScriptsWithContent(head) {
    const scriptName = "build-pwa-"+head+"-"+language+"-pug"
    packageJSON.scripts[scriptName] = getPugPWABuildLineWithContent(head, language)
    allPugPWABuildLine += " " + scriptName    
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
function injectBuildPWAStyleScript(head) {
    const scriptName = "build-pwa-" + head + "-style"
    packageJSON.scripts[scriptName] = getStylusPWABuildLine(head)
    allStylusPWABuildLine += " " + scriptName
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
function injectCleanPWACSSScript(head) {
    const scriptName = "clean-pwa-" + head + "-css"
    packageJSON.scripts[scriptName] = getCleanPWACSSLine(head)
    allPWACleaningLine += " " + scriptName
}
function injectPurgePWACSSScript(head) {
    const scriptName = "purge-pwa-" + head + "-css"
    packageJSON.scripts[scriptName] = getPurgePWACSSLine(head)
    allPWAPurgingLine += " " + scriptName
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
function getDevWorkerBundleLine(head) {
    const configFileName = "webpack-dev-worker-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
function getWatchBundleLine(head) {
    const configFileName = "webpack-watch-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}
function getWatchWorkerBundleLine(head) {
    const configFileName = "webpack-watch-worker-"+head+".config.js"
    const configFilePath = pathModule.resolve(configBasePath, configFileName)
    const scriptLine = "webpack-cli --config "+configFilePath 
    return scriptLine
}

function getPugBuildLineWithContent(head, langTag) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(adminPugHeadsPath, headFileName)
    const contentFileName = head+".json"
    const contentFilePath = pathModule.resolve(adminContentPath, langTag, contentFileName)
    const scriptLine = "pug "+headFilePath+" -o "+adminPugOutputBasePath+" --pretty --obj "+contentFilePath 
    return scriptLine
}
function getPugWatchLineWithContent(head, langTag) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(adminPugHeadsPath, headFileName)
    const contentFileName = head+".json"
    const contentFilePath = pathModule.resolve(adminContentPath, langTag, contentFileName)
    const scriptLine = "pug -w "+headFilePath+" -o "+adminPugOutputBasePath+" --pretty --obj "+contentFilePath 
    return scriptLine
}
function getPugPWABuildLineWithContent(head, langTag) {
    const headFileName = head+"body.pug"
    const headFilePath = pathModule.resolve(pwaPugHeadsPath, headFileName)
    const contentFileName = head+".json"
    const contentFilePath = pathModule.resolve(pwaContentPath, langTag, contentFileName)
    const scriptLine = "pug "+headFilePath+" -o "+pwaPugOutputBasePath+" --client"
    return scriptLine
}
function getPugBuildLineNoContent(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(adminPugHeadsPath, headFileName)
    const scriptLine = "pug "+headFilePath+" -o "+adminPugOutputBasePath+" --pretty" 
    return scriptLine
}
function getPugWatchLineNoContent(head) {
    const headFileName = head+".pug"
    const headFilePath = pathModule.resolve(adminPugHeadsPath, headFileName)
    const scriptLine = "pug -w "+headFilePath+" -o "+adminPugOutputBasePath+" --pretty" 
    return scriptLine
}

function getStylusBuildLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusAdminHeadsBasePath, headFileName)
    const scriptLine = "stylus "+headFilePath+" -o "+stylusAdminOutputBasePath+" --include-css" 
    return scriptLine
}
function getStylusWatchLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusAdminHeadsBasePath, headFileName)
    const scriptLine = "stylus -w "+headFilePath+" -o "+stylusAdminOutputBasePath+" --include-css" 
    return scriptLine
}
function getStylusPWABuildLine(head) {
    const headFileName = head+".styl"
    const headFilePath = pathModule.resolve(stylusPWAHeadsBasePath, headFileName)
    const scriptLine = "stylus "+headFilePath+" -o "+stylusPWAOutputBasePath+" --include-css" 
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
    const sourcePath = pathModule.resolve(dirtyAdminCSSPath, cssName)
    const destPath = pathModule.resolve(cleanAdminCSSPath, cssName)
    const scriptLine = "cleancss -O2 'specialComments:0' " + sourcePath +  " --output " + destPath 
    return scriptLine
}
function getPurgeCSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(cleanAdminCSSPath, cssName)
    const htmlName = head + ".html"
    const contentPath = pathModule.resolve(process.cwd(), "toolset/build/html/pretty", htmlName)
    const scriptLine = "purgecss --css " + sourcePath + " --content " + contentPath + " --output " + purgedAdminCSSPath 
    return scriptLine
}
function getCleanPWACSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(dirtyPWACSSPath, cssName)
    const destPath = pathModule.resolve(cleanPWACSSPath, cssName)
    const scriptLine = "cleancss -O2 'specialComments:0' " + sourcePath +  " --output " + destPath 
    return scriptLine
}
function getPurgePWACSSLine(head) {
    const cssName = head + ".css"
    const sourcePath = pathModule.resolve(cleanPWACSSPath, cssName)
    const htmlName = head + ".html"
    const contentPath = pathModule.resolve(process.cwd(), "toolset/build/html/pwa", htmlName)
    const scriptLine = "purgecss --css " + sourcePath + " --content " + contentPath + " --output " + purgedPWACSSPath 
    return scriptLine
}

//#endregion

//#endregion

//#region writePackageJSON
const packageJSONString = JSON.stringify(packageJSON, null, 4)
fs.writeFileSync(packageJSONPath, packageJSONString)
//#endregion