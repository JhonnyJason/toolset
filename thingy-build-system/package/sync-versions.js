#!/usr/bin/env node
//############################################################
const fs = require("fs")
const pathModule = require("path")

//############################################################
function synchronizeVersions(versions) {
    versionNumbers = versions.map((version) => version.split("."))
    // console.log(JSON.stringify(versionNumbers, null, 4))
    maxMajor = 0
    maxMinor = 0
    maxPatch = 0
    versionNumbers.forEach(numbers => {
        if(numbers[0] > maxMajor) maxMajor = numbers[0]
        if(numbers[1] > maxMinor) maxMinor = numbers[1]
        if(numbers[2] > maxPatch) maxPatch = numbers[2]
    });
    return ""+maxMajor+"."+maxMinor+"."+maxPatch
} 

//############################################################
basePackageJasonPath = pathModule.resolve("package.json")
sourcePackageJasonPath = pathModule.resolve("sources", "ressources", "package.json")
outputPackageJasonPath = pathModule.resolve("output", "package.json")

const basePackageJason = require(basePackageJasonPath)
const sourcePackageJason = require(sourcePackageJasonPath)
const outputPackageJason = require(outputPackageJasonPath)

allVersions = [basePackageJason.version, sourcePackageJason.version, outputPackageJason.version]
version = synchronizeVersions(allVersions)

// console.log(version)

basePackageJason.version = version
sourcePackageJason.version = version
outputPackageJason.version = version

//############################################################
const basePackageJasonString = JSON.stringify(basePackageJason, null, 4)
const sourcePackageJasonString = JSON.stringify(sourcePackageJason, null, 4)
const outputPackageJasonString = JSON.stringify(outputPackageJason, null, 4)

//############################################################
fs.writeFileSync(basePackageJasonPath, basePackageJasonString)
fs.writeFileSync(sourcePackageJasonPath, sourcePackageJasonString)
fs.writeFileSync(outputPackageJasonPath, outputPackageJasonString)