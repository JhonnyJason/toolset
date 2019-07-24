const fs = require("fs")
const pathModule = require("path")

const jsDest = "output/"
const coffeeSource = "sources/source/*/*.coffee"

//shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const toolsetCliBase = "toolset/thingy-build-system/cli/"
const pushScript = toolsetCliBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetCliBase + "pull-all.sh" 
const cleanPackageScript = toolsetCliBase + "clean-package.sh"
const installNodeModulesScript = toolsetCliBase + "install-node-modules.sh"


var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "cli",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns build",
            
            // overwrite the general base stuff
            "build-coffee": "coffee -o " + jsDest + " -c " + coffeeSource,
            "watch-coffee": "coffee -o " + jsDest + " -cw " + coffeeSource,
    
            //For testing and building
            // "test": "run-s -ns build watch",
            "build": "run-s -ns clean-package build-coffee copyscript install-node-modules",
            "watch": "run-p -nsr watch-coffee",
            
            // shellscripts to be called
            "clean-package": cleanPackageScript,
            "install-node-modules": installNodeModulesScript,
            "copyscript": copyScript,
            "push": pushScript,
            "pull": pullScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = { }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    },
    produceConfigFiles: (projectRoot) => {
        return
    }
}