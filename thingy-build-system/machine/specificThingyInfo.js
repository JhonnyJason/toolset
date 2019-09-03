const fs = require("fs")
const pathModule = require("path")

const configPath = "sources/machine-config.js"
const keysPath = "output/keys"
const serviceFilesPath = "output/service-files"
const nginxFilesPath = "output/nginx-files"
// const installerPath = "output/installer.js"

const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

//shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const toolsetMachineBase = "toolset/thingy-build-system/machine/"
const releaseScript = toolsetMachineBase + "release-script.sh"
const inspectInstallScript = toolsetMachineBase + "build-and-inspect.sh"
const createFoldersScript = toolsetMachineBase + "create-folders.sh"
const pushScript = toolsetMachineBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetMachineBase + "pull-all.sh" 

const createCommanderAndWebhookConfigScript = toolsetMachineBase + "create-commander-and-webhook-config.js"

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
            "initialize-thingy": "run-s -ns create-folders prepare",

            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,

            //For testing and building
            "build-installer": "run-s -ns build-coffee bundle",
            "watch-installer": "run-p -nsr watch-coffee watch-bundle",
            "inspect-new-build": "run-s -ns build-installer inspect-install",
            //TODO watch machine config to rebuild commander and webhandlerconfig
            //"watch": ...

            "prepare-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m prepare",
            "refresh-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m refresh",
            "remove-deployment": "prepare-machine-thingy-deployment -k " + keysPath + " -c " + configPath + " -m remove",

            "generate-files": "run-s -ns generate-nginx-files generate-service-files",
            "generate-nginx-files": "generate-nginx-config-for-thingies " + configPath + " " + nginxFilesPath,
            "generate-service-files": "generate-service-files-for-thingies " + configPath + " " + serviceFilesPath,


            "prepare": "run-s -ns create-commander-and-webhook-config prepare-deployment generate-files copyscript build-installer",
            "release": "run-s -ns prepare release-script",
            // testing convenience

            // shellscripts to be called
            "release-script": releaseScript,
            "inspect-install": inspectInstallScript,
            "create-commander-and-webhook-config": createCommanderAndWebhookConfigScript,
            "create-folders": createFoldersScript,            
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
            "generate-nginx-config-for-thingies": "^0.1.1",
            "generate-service-files-for-thingies": "^0.1.2",
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