const fs = require("fs")
const pathModule = require("path")

const servicePath = "output/service.js"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"

const toolsetWebsiteBase = "toolset/thingy-build-system/website/"
const createFoldersScript = toolsetWebsiteBase + "create-compile-folders.sh" 
const pushScript = toolsetWebsiteBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetWebsiteBase + "pull-all.sh" 


var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "service",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns patch-stuff create-compile-folders copyscript build",

            
            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,

            "watch-service": "nodemon " + servicePath,

            //For testing and building
            "test": "run-s -ns build watch",
            "build": "run-s -ns build-coffee bundle",
            "watch": "run-p -nsr watch-coffee watch-bundle watch-service",
            
            // shellscripts to be called
            "create-compile-folders": createFoldersScript,            
            "patch-stuff": patchScript,
            "copyscript": copyScript,
            "push": pushScript,
            "pull": pullScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "chalk": "^2.4.2",
            "clear": "0.0.1",
            "clui": "^0.3.6",
            "figlet": "^1.2.3",
            "inquirer": "^5.2.0",
            "minimist": "^1.2.0"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    },
    produceConfigFiles: (projectRoot) => {
        return
    }
}