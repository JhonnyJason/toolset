#!/usr/bin/env node
//############################################################
const fs = require("fs")
const pathModule = require("path")

//############################################################
const generalThingyBase = require("./generalThingyBase.js")
const specificThingyInfo = require("./specificThingyInfo.js")

const projectRoot = pathModule.resolve(process.cwd(), "..")
const packageJasonPath = pathModule.resolve(projectRoot, "package.json")

//############################################################
var langTag = null
try {
    const oldPackageJson = require(packageJasonPath)
    langTag = oldPackageJson.lang
} catch (err) {console.log(err.message)}

//############################################################
var packageJason = generalThingyBase.getBase()
var scripts = packageJason.scripts
var dependencies = packageJason.dependencies

//############################################################
var thingyScripts = specificThingyInfo.getScripts()
var thingyDepencencies = specificThingyInfo.getDependencies()

//############################################################
if(langTag == null) {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    langTag = locale.substring(0,2)    
}


//############################################################
packageJason.thingytype = specificThingyInfo.thingytype
packageJason.type = specificThingyInfo.type
packageJason.lang = langTag
Object.assign(scripts, thingyScripts)
Object.assign(dependencies, thingyDepencencies)

//############################################################
const packageJasonString = JSON.stringify(packageJason, null, 4)

//############################################################
fs.writeFileSync(packageJasonPath, packageJasonString)
if(specificThingyInfo.produceConfigFiles) 
    specificThingyInfo.produceConfigFiles(projectRoot)

