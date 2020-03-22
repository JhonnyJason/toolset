#!/usr/bin/env node
//############################################################
const fs = require("fs")
const pathModule = require("path")

//############################################################
basePackageJasonPath = pathModule.resolve("package.json")
sourcePackageJasonPath = pathModule.resolve("sources", "ressources", "package.json")
outputPackageJasonPath = pathModule.resolve("output", "package.json")

const basePackageJason = require(basePackageJasonPath)
const sourcePackageJason = require(sourcePackageJasonPath)
const outputPackageJason = require(outputPackageJasonPath)

console.log("base-version: " + basePackageJason.version)
console.log("source-version: " + sourcePackageJason.version)
console.log("output-version: " + outputPackageJason.version)


//############################################################
// const basePackageJasonString = JSON.stringify(basePackageJason, null, 4)
// const sourcePackageJasonString = JSON.stringify(sourcePackageJason, null, 4)
// const outputPackageJasonString = JSON.stringify(outputPackageJason, null, 4)

//############################################################
// fs.writeFileSync(basePackageJasonPath, basePackageJasonString)
// fs.writeFileSync(sourcePackageJasonPath, sourcePackageJasonString)
// fs.writeFileSync(outputPackageJasonPath, outputPackageJasonString)

