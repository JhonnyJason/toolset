#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const expectedCertPath = pathModule.resolve(process.cwd(), "testing/certificates/cert.pem") 
const expectedKeyPath = pathModule.resolve(process.cwd(), "testing/certificates/key.pem")

const exportsString = "module.exports = "

//#region configFileStuff
const configName = "browser-sync.config.js"
const configPath = pathModule.resolve(process.cwd(), ".build-config", configName)

var config = {}
try {config = require(configPath)} catch(error) {}
//#endregion

var certExists = false
try{ 
    var stat = fs.lstatSync(expectedCertPath)
    certExists = stat.isFile() 
} catch(error) {}

var keyExists = false
try{
    var stat = fs.lstatSync(expectedKeyPath)
    keyExists = stat.isFile() 
} catch(error) {}

if(keyExists && certExists) {
    if(!config.https) config.https = {}
    config.https.key = expectedKeyPath
    config.https.cert = expectedCertPath
} else if (config.https) {
    delete config.https
}

//#region writeConfigFiles
const configString = exportsString + JSON.stringify(config, null, 4)
fs.writeFileSync(configPath, configString)
//#endregion