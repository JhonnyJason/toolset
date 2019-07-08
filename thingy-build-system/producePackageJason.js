#!/usr/bin/env node
const fs = require("fs").promises

const generalThingyBase = require("./generalThingyBase")
const specificThingyInfo = require("./specificThingyInfo")

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}



const delayPromise = (timeMS) => {
    return new Promise((resolve) => { setTimeout(resolve, timeMS) })
}

const producePackageJason = async () => {
    console.log("sourceInfo is: " + sourceInfo)
    var packageJason = generalThingyBase.getBase()
    var scripts = packageJason.scripts
    var dependencies = packageJason.dependencies

    var thingyScripts = specificThingyInfo.getScripts()
    var thingyDepencencies = specificThingyInfo.getDependencies()
    
    console.log(JSON.stringify(packageJason, null, 2))
    //read name and type
    // var promises = []

    // promises.push()
    
    //
}

producePackageJason()