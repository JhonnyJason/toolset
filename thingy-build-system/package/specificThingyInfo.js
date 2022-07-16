const fs = require("fs")
const pathModule = require("path")

const jsDest = "output/"
const coffeeSource = "sources/source/*/*.coffee"
const liveSource = "sources/source/*/*.ls"

//#region shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const base = "toolset/thingy-build-system/package/"
const updatePackagesScript = base + "update-packages.sh"
const publishScript = base + "publish-on-npm.sh"
const cleanPackageScript = base + "clean-package.sh"
const installNodeModulesScript = base + "install-node-modules.sh"
const incVersionsScript = base + "inc-versions.js"
const syncVersionsScript = base + "sync-versions.js"
const updateToolsScript = base + "update-tools.sh"
//#endregion

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    thingytype: "package",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns build",
            
            // overwrite the general base stuff
            "build-coffee": "coffee -o " + jsDest + " -c " + coffeeSource,
            "watch-coffee": "coffee -o " + jsDest + " -cw " + coffeeSource,

            "build-live": "lsc -o " + jsDest + " -c " + liveSource,
            "watch-live": "lsc -o " + jsDest + " -cw " + liveSource,

            "copy-all-js": "cp sources/source/*/*.js output/",

            "sync-allmodules": "thingy-allmodules-sync",

            //For testing and building
            // "test": "run-s -ns build watch",
            "build": "run-s -ns clean-package copy-all-js build-live build-coffee copyscript install-node-modules",
            "watch": "run-p -nsr copy-all-js watch-live watch-coffee",
            
            //for release
            "release": "run-s -ns build publish-script",

            "package-update-release": "run-s -ns update-tools update-packages inc-versions update-cli-packages push release",

            // shellscripts to be called
            "inc-versions": incVersionsScript,
            "sync-versions": syncVersionsScript,
            "update-tools": updateToolsScript,
            "update-package-packages": updatePackagesScript,
            "publish-script": publishScript,
            "clean-package": cleanPackageScript,
            "install-node-modules": installNodeModulesScript,
            "copyscript": copyScript
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