const fs = require("fs")
const pathModule = require("path")

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

const stylusHeads = "toolset/build/heads/styl/*"
const dirtyCssDest = "toolset/build/css/dirty/"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"
const linkerScript = "sources/ressources/linkerscript.sh"


const toolsetPwaBase = "toolset/thingy-build-system/pwa/"
const createCertsScript = toolsetPwaBase + "create-certificates.sh"
const injectCssScriptsScript = toolsetPwaBase + "inject-css-scripts.js"
const buildBrowserSyncConfigScript = toolsetPwaBase + "rebuild-browser-sync-config.js"
const buildWebpackConfigScript = toolsetPwaBase + "rebuild-webpack-config.js"
const buildWebpackWorkerConfigScript = toolsetPwaBase + "rebuild-webpack-worker-config.js"
const linkIncludesForTestingScript = toolsetPwaBase + "link-for-testing.js"
const linkIncludesForDeploymentScript = toolsetPwaBase + "link-for-deployment.js"
const linkDevWorkerScript = toolsetPwaBase + "link-dev-worker.js"
const linkDevHtmlScript = toolsetPwaBase + "link-test-html.js"
const createBuildHeadsScript = toolsetPwaBase + "create-build-heads.js"
const createBuildDirectoriesScript = toolsetPwaBase + "create-build-directories.sh" 
const copyMinifiedHTMLScript = toolsetPwaBase + "copy-minified-html.sh"
const copyDeployWorkerScript = toolsetPwaBase + "copy-deploy-worker.sh"
const releaseScript = toolsetPwaBase + "release-script.sh"

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "pwa",
    getScripts: () => {
        return {
    
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns create-build-directories inject-css-scripts cert-setup patch-stuff prepare-for-test",
            
            //our most called scripts
            "test": "run-s -ns prepare-for-test watch-for-test",
            "prepare-for-test": "run-s -ns create-dev-bundles create-build-heads build-style link-for-test build-pug dev-linkage",
            "dev-linkage": "run-s -ns link-dev-worker link-test-html link-ressources",
            "create-dev-bundles": "run-s -ns build-coffee prepare-webpack dev-bundle dev-worker-bundle", 
            "watch-for-test": "run-p watch-coffee watch-bundle watch-worker-bundle watch-style watch-pug expose",
            
            //for deployment
            "check-deployment": "run-s -ns deployment-build expose-deployment",
            "deployment-build": "run-s -ns create-deployment-bundles create-build-heads create-deployment-css create-deployment-html copy-for-deployment",
            "create-deployment-html": "run-s -ns link-for-deployment build-pug minify-html",
            "create-deployment-css": "run-s -ns build-style clean-css purge-css",
            "create-deployment-bundles": "run-s -ns build-coffee prepare-webpack deploy-bundle deploy-worker-bundle",
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
            //general preparation scripts
            "patch-stuff": patchScript,
            "create-build-directories": createBuildDirectoriesScript,
            "create-build-heads": createBuildHeadsScript,
            "create-certs": createCertsScript,
            "inject-css-scripts": injectCssScriptsScript,
            
            //scropts for building config files
            "rebuild-browser-sync-config": buildBrowserSyncConfigScript,
            "rebuild-webpack-config": buildWebpackConfigScript,
            "rebuild-webpack-worker-config": buildWebpackWorkerConfigScript,
            
            //linkage for testing
            "link-for-test": linkIncludesForTestingScript,
            "link-dev-worker": linkDevWorkerScript,
            "link-test-html": linkDevHtmlScript,
            "link-ressources": linkerScript,
            
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
            "browser-sync": "^2.26.7",
            "clean-css-cli": "^4.3.0",
            "html-minifier": "^4.0.0",
            "pug-cli": "^1.0.0-alpha6",
            "purgecss": "^1.4.2",
            "stylus": "^0.54.7",
            "webpack": "^4.41.5",
            "webpack-cli": "^3.3.10"    
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    }
}