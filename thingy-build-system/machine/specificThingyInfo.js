const fs = require("fs")
const pathModule = require("path")

const configPath = "sources/machine-config.js"
const keysPath = "output/keys"
const installerPath = "output/installer.js"

const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

//shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const toolsetMachineBase = "toolset/thingy-build-system/machine/"
const createFoldersScript = toolsetMachineBase + "create-compile-folders.sh"
const pushScript = toolsetMachineBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetMachineBase + "pull-all.sh" 

const createCommanderAndWebhookConfigScript = toolsetMachineBase + "create-commander-and-webhook-config.js"
const createWebhookConfigScript = toolsetMachineBase + "create-webhook-config.js"
const createCommanderScript = toolsetMachineBase + "create-commander.js"


var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "machine",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            // "initialize-thingy": "run-s -ns create-compile-folders copyscript build",
            "initialize-thingy": "run-s -ns create-compile-folders copyscript",

            // "bundle": "webpack-cli --config " + webpackConfig,
            // "watch-bundle": "webpack-cli --config " + webpackWatchConfig,

            // "watch-service": "nodemon " + servicePath,

            //For testing and building
            // "test": "run-s -ns build watch",
            // "build": "run-s -ns build-coffee bundle",
            // "watch": "run-p -nsr watch-coffee watch-bundle watch-service",
            
            "prepare-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m prepare",
            "refresh-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m refresh",
            "remove-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m remove",

            // shellscripts to be called
            "create-commander-and-webhook-config": createCommanderAndWebhookConfigScript,
            "create-commander": createCommanderScript,
            "create-webhook-config": createWebhookConfigScript,
            "create-compile-folders": createFoldersScript,            
            "copyscript": copyScript,
            "push": pushScript,
            "pull": pullScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "mustache": "^2.3.2",
            "webpack": "^4.29.0",
            "webpack-cli": "^3.2.1",
            "prepare-machine-thingy-deployment": "^0.1.0"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    },
    produceConfigFiles: (projectRoot) => {
        const exportsString = "module.exports = "
        

        const webpackConfigObject = {
            mode: "production",
            devtool: "none",
            target: "node",
            entry: pathModule.resolve(projectRoot, "toolset/compiled/js/index.js"),
            output: {
                filename: 'installer.js',
                path: pathModule.resolve(projectRoot, 'output/')
            }
        }
        
        const configString = exportsString + JSON.stringify(webpackConfigObject, null, 4)
        webpackConfigObject.watch = true

        const watchConfigString = exportsString + JSON.stringify(webpackConfigObject, null, 4)
        const configPath = pathModule.resolve(projectRoot, webpackConfig)
        const watchConfigPath = pathModule.resolve(projectRoot, webpackWatchConfig)

        // console.log("\nWebpack config path: " + configPath)
        // console.log(configString)
        // console.log("\nWebpack watch config path: " + watchConfigPath)
        // console.log(watchConfigString)
        fs.writeFileSync(configPath, configString)
        fs.writeFileSync(watchConfigPath, watchConfigString)
    }
}