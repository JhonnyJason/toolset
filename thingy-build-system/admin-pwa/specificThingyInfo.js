const fs = require("fs")
const pathModule = require("path")

//#region stringDefinitions 
const testDir = "testing/document-root/"
const deployDir = "output/"

const browserSyncConfig = ".build-config/browser-sync.config.js"

const pugHeads = "toolset/build/heads/pug/*"
const prettyHtml = "toolset/build/html/pretty/"
const minifiedHTML = "toolset/build/html/minified/"

const webpackDevConfig = ".build-config/webpack-dev.config.js"
const webpackDevWorkerConfig = ".build-config/webpack-dev-worker.config.js"
const webpackWatchConfig = ".build-config/webpack-watch.config.js"
const webpackWatchWorkerConfig = ".build-config/webpack-watch-worker.config.js"
const webpackDeployConfig = ".build-config/webpack-deploy.config.js"
const webpackDeployWorkerConfig = ".build-config/webpack-deploy-worker.config.js"

//pwa paths
const jsDestPWA = "toolset/build/pwa-js"
const coffeeSourcePWA = "pwa-sources/source/*/*.coffee"
const liveSourcePWA = "pwa-sources/source/*/*.ls"
const jsSourcePWA = "pwa-sources/source/*/*.js"
const webpackPWAConfig = ".build-config/webpack-pwa.config.js"

const stylusHeads = "toolset/build/heads/styl/*"
const dirtyCssDest = "toolset/build/css/dirty/"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"
const linkerScript = "sources/ressources/linkerscript.sh"


const base = "toolset/thingy-build-system/admin-pwa/"
const createCertsScript = base + "create-certificates.sh"
const injectAllScriptsScript = base + "inject-all-scripts.js"
const buildBrowserSyncConfigScript = base + "rebuild-browser-sync-config.js"
const buildWebpackConfigScript = base + "rebuild-webpack-config.js"
const buildWebpackWorkerConfigScript = base + "rebuild-webpack-worker-config.js"
const linkIncludesForTestingScript = base + "link-for-testing.js"
const linkIncludesForDeploymentScript = base + "link-for-deployment.js"
const linkIncludesForPWAScript = base + "link-for-pwa.js"
const linkDevWorkerScript = base + "link-dev-worker.js"
const linkDevHtmlScript = base + "link-test-html.js"
const createBuildHeadsScript = base + "create-build-heads.js"
const createBuildDirectoriesScript = base + "create-build-directories.sh" 
const copyMinifiedHTMLScript = base + "copy-minified-html.sh"
const copyDeployWorkerScript = base + "copy-deploy-worker.sh"
const releaseScript = base + "release-script.sh"
const updateToolsScript = base + "update-tools.sh"

//#endregion

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}
try {
    pwaSourceInfo = require("../../../pwa-sources/sourceInfo")
} catch(err) { 
    console.log(err.message)
}


// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    thingytype: "admin-pwa",
    getScripts: () => {
        return {
            
            "build-pwa-coffee": "coffee -o " + jsDestPWA + " -c " + coffeeSourcePWA,
            "build-pwa-live": "lsc -o " + jsDestPWA + " -c " + liveSourcePWA,
            "copy-pwa-js": "cp "+jsSourcePWA+" "+jsDestPWA,
            "pwa-bundle": "webpack-cli --config " + webpackPWAConfig,
            "build-pwa": "run-s -ns build-pwa-coffee pwa-bundle build-pwa-style link-for-pwa build-pwa-pug clean-pwa-css purge-pwa-css",

            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns create-build-directories cert-setup patch-stuff inject-scripts build-pwa prepare-for-test",
            
            //our most called scripts
            "test": "run-s -ns inject-scripts prepare-for-test watch-for-test",
            "prepare-for-test": "run-s -ns connect-dom create-dev-bundles create-build-heads build-style link-for-test build-pug dev-linkage",
            "dev-linkage": "run-s -ns link-dev-worker link-test-html link-ressources",
            "create-dev-bundles": "run-s -ns link-all-js-and-json build-live build-coffee prepare-webpack dev-bundle dev-worker-bundle", 
            "watch-for-test": "run-p watch-connect-dom watch-live watch-coffee watch-bundle watch-worker-bundle watch-style watch-pug expose",
            
            //for deployment
            "check-deployment": "run-s -ns deployment-build expose-deployment",
            "deployment-build": "run-s -ns inject-scripts create-deployment-stuff",
            "create-deployment-stuff": "run-s -ns connect-dom create-deployment-bundles create-build-heads create-deployment-css create-deployment-html copy-for-deployment",
            "create-deployment-html": "run-s -ns link-for-deployment build-pug minify-html",
            "create-deployment-css": "run-s -ns build-style clean-css purge-css",
            "create-deployment-bundles": "run-s -ns link-all-js-and-json build-live build-coffee prepare-webpack deploy-bundle deploy-worker-bundle",
            "copy-for-deployment": "run-s -ns copy-minified-html copy-deploy-worker copy-ressources",
            

            //browser-sync stuff
            "cert-setup": "run-s create-certs rebuild-browser-sync-config",
            "expose-deployment": "browser-sync start --server '"+deployDir+"' --files '"+deployDir+"*' --no-open --config " + browserSyncConfig,
            "expose": "browser-sync start --server '"+testDir+"' --files '"+testDir+"*' --no-open --config " + browserSyncConfig,
            
            //html Stuff
            "build-pug": "pug "+pugHeads+" -o "+prettyHtml+" --pretty",
            "watch-pug": "pug -w "+pugHeads+" -o "+prettyHtml+" --pretty",
            "minify-html": "html-minifier --input-dir "+prettyHtml+" --output-dir "+minifiedHTML+" --file-ext html --collapse-whitespace --remove-comments --remove-redundant-attributes --remove-script-type-attributes --use-short-doctype --minify-js true --minify-css true",
            

            //webpack Stuff            
            "prepare-webpack": "run-s rebuild-webpack-worker-config rebuild-webpack-config",
            // the Bundling
            "dev-bundle": "webpack-cli --config " + webpackDevConfig,
            "dev-worker-bundle": "webpack-cli --config " + webpackDevWorkerConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,
            "watch-worker-bundle": "webpack-cli --config " + webpackWatchWorkerConfig,
            "deploy-bundle": "webpack-cli --config " + webpackDeployConfig,
            "deploy-worker-bundle": "webpack-cli --config " + webpackDeployWorkerConfig,

            //style stuff
            "build-style": "stylus "+stylusHeads+" -o "+dirtyCssDest+" --include-css",
            "watch-style": "stylus -w "+stylusHeads+" -o "+dirtyCssDest+" --include-css",


            //createing modules stuff
            "pageheadcreate": "cd sources/page-heads && thingymodulecreate",
    
            "create-sub-sourcemodule": "run-s -ns  \"sourcemodulecreate submodule,{1},create,uisourcemodule\"  --",
            "create-dir-sourcemodule": "run-s -ns  \"sourcemodulecreate directory,{1},create,uisourcemodule\"  --",
            "create-dir-pagehead": "run-s -ns  \"pageheadcreate directory,{1},create,sourcespagehead\"  --",
            "create-dir-pageheadsourcemodule": "run-s -ns  \"sourcemodulecreate directory,{1},create,pageheadsourcemodule\"  --",
            
            "create-subapp": "run-s -ns \"create-dir-pagehead {1}\" \"create-dir-pageheadsourcemodule {1}\" --",
            
            // external scripts
            "update-tools": updateToolsScript,
            
            //general preparation scripts
            "patch-stuff": patchScript,
            "create-build-directories": createBuildDirectoriesScript,
            "create-build-heads": createBuildHeadsScript,
            "create-certs": createCertsScript,
        
            //the injection Scripts
            "inject-scripts": injectAllScriptsScript,
            
            //scropts for building config files
            "rebuild-browser-sync-config": buildBrowserSyncConfigScript,
            "rebuild-webpack-config": buildWebpackConfigScript,
            "rebuild-webpack-worker-config": buildWebpackWorkerConfigScript,
            
            //linkage for testing
            "link-for-test": linkIncludesForTestingScript,
            "link-dev-worker": linkDevWorkerScript,
            "link-test-html": linkDevHtmlScript,
            "link-ressources": linkerScript,
            
            "link-for-pwa": linkIncludesForPWAScript,
            //deployment scripts
            "link-for-deployment": linkIncludesForDeploymentScript,
            "copy-minified-html": copyMinifiedHTMLScript,
            "copy-deploy-worker": copyDeployWorkerScript,
            "copy-ressources": copyScript,
            
            //pushes output to release branch
            "release": releaseScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "browser-sync": "^2.27.11",
            "clean-css-cli": "^5.6.1",
            "html-minifier": "^4.0.0",
            "implicit-dom-connect": "^0.2.3",
            "pug-cli": "^1.0.0-alpha6",
            "purgecss": "^4.1.3",
            "stylus": "^0.59.0",
            "webpack": "^5.75.0",
            "webpack-cli": "^5.0.1"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        
        if(pwaSourceInfo) {
            Object.assign(thingyDeps, pwaSourceInfo.getDependencies())
        }
        
        return thingyDeps

    }
}