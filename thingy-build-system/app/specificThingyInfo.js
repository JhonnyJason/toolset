const fs = require("fs")
const pathModule = require("path")

const stylusIndexIOS = "sources/source/ios/index.styl"
const stylusIndexAndroid = "sources/source/android/index.styl"
const pugIndexIOS = "sources/source/ios/index.pug"
const pugIndexAndroid = "sources/source/android/index.pug"
const htmlDestAndroid = "toolset/cordova-source/merges/android"
const htmlDestIOS = "toolset/cordova-source/merges/ios"
const cssDest = "toolset/compiled/css/"

const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"

const toolsetAppBase = "toolset/thingy-build-system/app/"

const createFoldersScript = toolsetAppBase + "create-compile-folders.sh"

const createLocalBuildScript = toolsetAppBase + "phonegap-create-build.sh"
const prepareCordovaScript = toolsetAppBase + "phonegap-prepare.sh"

const iosReleaseScript = toolsetAppBase + "push-ios-release.sh"
const androidReleaseScript = toolsetAppBase + "push-android-release.sh"

const gitSetupScript = toolsetAppBase + "git-setup.sh"
const pushScript = toolsetAppBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetAppBase + "pull-all.sh" 


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
        var thingyScripts = {

            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns git-setup pull patch-stuff create-compile-folders copyscript build create-local-build prepare-phonegap",
      
            //the generalBase already includes a script named "build-coffee" and "watch-coffee"
            "build-js": "run-s -ns build-coffee bundle",
            "watch-js": "run-p -nsr watch-coffee watch-bundle",

            //android build lane
            "android-build-styl": "stylus " + stylusIndexAndroid + " -o " + cssDest,
            "android-watch-styl": "stylus " + stylusIndexAndroid + " -o " + cssDest + " -w",
            "android-build-index-pug": "pug -o " + htmlDestAndroid + " " + pugIndexAndroid,
            "android-watch-index-pug": "pug -o " + htmlDestAndroid + " " + pugIndexAndroid + " -w",
            
            //IOS build lane
            "ios-build-styl": "stylus " + stylusIndexIOS + " -o " + cssDest,
            "ios-watch-styl": "stylus " + stylusIndexIOS + " -o " + cssDest + " -w",
            "ios-build-index-pug": "pug -o " + htmlDestIOS +  " " + pugIndexIOS,
            "ios-watch-index-pug": "pug -o " + htmlDestIOS +  " " + pugIndexIOS + " -w",

            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,
            
            //For testing and building
            "test": "run-s -ns build watch",
            "build": "run-s -ns android-build-styl ios-build-styl build-js android-build-index-pug ios-build-index-pug",
            "watch": "run-p -rns android-watch-styl ios-watch-styl android-watch-index-pug watch-js ios-watch-index-pug",
                        
            //do release
            "releases": "npm-run-all ios-release android-release",
            
            // shellscripts to be called            
            "patch-stuff": patchScript,
            "copyscript": copyScript,
            "create-compile-folders": createFoldersScript,

            "create-local-build": createLocalBuildScript,
            "prepare-phonegap": prepareCordovaScript,      

            "android-release": androidReleaseScript,
            "ios-release": iosReleaseScript,

            "git-setup": gitSetupScript,
            "push": pushScript,
            "pull": pullScript          
        }

        if(sourceInfo) {
            Object.assign(thingyScripts, sourceInfo.getScripts())
        }

        return thingyScripts
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "cordova-icon": "^1.0.0",
            "browser-sync": "^2.26.3",
            "pug-cli": "^1.0.0-alpha6",
            "stylus": "^0.54.5",
            "terser": "^3.14.1",
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
            entry: {
                android: pathModule.resolve(projectRoot, "toolset/compiled/js/android.js"),
                ios: pathModule.resolve(projectRoot, "toolset/compiled/js/ios.js")
            },
            output: {
                filename: '[name].js',
                path: pathModule.resolve(projectRoot, 'toolset/compiled')
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