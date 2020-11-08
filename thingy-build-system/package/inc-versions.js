#!/usr/bin/env node
//############################################################
const fs = require("fs")
const pathModule = require("path")

//############################################################
function incrementVersion(version) {
    versionNumbers = version.split(".")
    versionNumbers[2] = parseInt(versionNumbers[2]) + 1
    version = versionNumbers.join(".")
    return version
} 

//############################################################
basePackageJasonPath = pathModule.resolve("package.json")
sourcePackageJasonPath = pathModule.resolve("sources", "ressources", "package.json")
outputPackageJasonPath = pathModule.resolve("output", "package.json")

const basePackageJason = require(basePackageJasonPath)
const sourcePackageJason = require(sourcePackageJasonPath)
const outputPackageJason = require(outputPackageJasonPath)

baseVersion = incrementVersion(basePackageJason.version)
sourceVersion = incrementVersion(sourcePackageJason.version)
outputVersion = incrementVersion(outputPackageJason.version)

// console.log("base-version: " + baseVersion)
// console.log("source-version: " + sourceVersion)
// console.log("output-version: " + outputVersion)

basePackageJason.version = baseVersion
sourcePackageJason.version = sourceVersion
outputPackageJason.version = outputVersion

//############################################################
const basePackageJasonString = JSON.stringify(basePackageJason, null, 4)
const sourcePackageJasonString = JSON.stringify(sourcePackageJason, null, 4)
const outputPackageJasonString = JSON.stringify(outputPackageJason, null, 4)

//############################################################
fs.writeFileSync(basePackageJasonPath, basePackageJasonString)
fs.writeFileSync(sourcePackageJasonPath, sourcePackageJasonString)
fs.writeFileSync(outputPackageJasonPath, outputPackageJasonString)

