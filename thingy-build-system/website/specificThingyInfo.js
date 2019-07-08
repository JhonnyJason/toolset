const fs = require("fs")
const pathModule = require("path")

const stylusIndex = "sources/source/index/index.styl"
const cssDest = "toolset/compiled/css/"
const pugIndex = "sources/source/index/index.pug"
const htmlDest = "output/"
const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

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
    type: "website",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns patch-stuff create-compile-folders build copyscript",

            //the generalBase already includes a script named "build-coffee" and "watch-coffee"
            "build-js": "run-s -ns build-coffee bundle",
            "watch-js": "run-p -nsr watch-coffee watch-bundle",
            
            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,
            
            "build-styl": "stylus " + stylusIndex + " -o " + cssDest,
            "watch-styl": "stylus " + stylusIndex + " -o " + cssDest + " -w",
            
            "build-index-pug": "pug -o " + htmlDest + " " + pugIndex,
            "watch-index-pug": "pug -o " + htmlDest + " " + pugIndex + " -w",
            
            //For testing and building
            "test": "run-s -ns build watch",
            "build": "run-s -ns build-styl build-js build-index-pug",
            "watch": "run-p -nsr watch-js watch-styl watch-index-pug ui-sync",
            //synced testing
            "ui-sync": "browser-sync start --server '" + htmlDest + "' --files '" + htmlDest + "index.html' --no-open",
            
            // shellscripts to be called            
            "patch-stuff": patchScript,
            "copyscript": copyScript,
            "create-compile-folders": createFoldersScript,
            "push": pushScript,
            "pull": pullScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "browser-sync": "^2.26.3",
            "pug-cli": "^1.0.0-alpha6",
            "stylus": "^0.54.5",
            "webpack": "^4.29.0",
            "webpack-cli": "^3.2.1"      
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
            entry: "toolset/compiled/js/index.js",
            output: {
                filename: 'bundle.js',
                path: 'toolset/compiled'
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