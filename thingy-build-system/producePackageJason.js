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
var packageJason = generalThingyBase.getBase()
var scripts = packageJason.scripts
var dependencies = packageJason.dependencies

//############################################################
var thingyScripts = specificThingyInfo.getScripts()
var thingyDepencencies = specificThingyInfo.getDependencies()

//############################################################
packageJason.type = specificThingyInfo.type
Object.assign(scripts, thingyScripts)
Object.assign(dependencies, thingyDepencencies)

//############################################################
const packageJasonString = JSON.stringify(packageJason, null, 4)

//############################################################
fs.writeFileSync(packageJasonPath, packageJasonString)
if(specificThingyInfo.produceConfigFiles) 
    specificThingyInfo.produceConfigFiles(projectRoot)

