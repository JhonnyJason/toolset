//############################################################
const pathModule = require("path")
const fs = require("fs")

//############################################################
const stdAuthor = "Lenard Frommelt"
const stdInitialVersion = "0.0.1"
const stdLicense = "Unlicense"

//############################################################
const coffeeSource = "sources/source/*/*.coffee"
const liveSource = "sources/source/*/*.ls"
const jsDest = "toolset/build/js/"

//############################################################
const base = "toolset/thingy-build-system/"
const linkAllJSSCript = base + "link-all-js-and-json.js"

//############################################################
//#region 
const getThingyName = () => {
    var cwd = process.cwd()
    // console.log("getBase in cwd: " + cwd)
    var directoryChain = cwd.split(pathModule.sep)
    if(directoryChain.length < 2) {
        throw new Error("Unexpected cwd: " + cwd + "\n Too small path depth!")
    } else if(directoryChain[directoryChain.length - 1] != "toolset") {
        throw new Error("Unexpected cwd: " + cwd + "\n the last directory is not 'toolset'")
    }

    return directoryChain[directoryChain.length - 2]
} 

const getThingyRemote = () => {
    const gitConfigPath = pathModule.resolve("../.git/config")
    const gitConfig = fs.readFileSync(gitConfigPath, "utf8")
    const remoteSegment = '[remote "origin"]'
    const urlSegment = "\n\turl = "
    const fetchSegment = "\n\tfetch = "
    const remoteSegmentIndex = gitConfig.indexOf(remoteSegment)
    const urlSegmentIndex = gitConfig.indexOf(urlSegment, remoteSegmentIndex)
    const fetchSegmentIndex = gitConfig.indexOf(fetchSegment, urlSegmentIndex)
    const remoteStart = urlSegmentIndex + urlSegment.length
    const remoteEnd = fetchSegmentIndex
    const result = gitConfig.slice(remoteStart, remoteEnd)
    
    let httpsResult = ""

    if(result.substr(0, 8) == "https://") httpsResult = result
    if(result.substr(0, 4) == "git@") {
        httpsResult = result.replace(":", "/")
        httpsResult = httpsResult.replace("git@", "https://")
    } else {
        throw "Remote was neither started with https:// nor git@"
    }
    if(httpsResult.lastIndexOf(".git") == (httpsResult.length - 4))
        httpsResult = httpsResult.slice(0, -4)
    return httpsResult
}

const getBaseScripts = (name) => {
    return {
        "build-coffee": "coffee -o " + jsDest + " -c " + coffeeSource,
        "watch-coffee": "coffee -o " + jsDest + " -cw " + coffeeSource,
    
        // "build-live": "lsc -o " + jsDest + " -c " + liveSource,
        "build-live": "echo 0",
        // "watch-live": "lsc -o " + jsDest + " -cw " + liveSource,
        "watch-live": "echo 0",
        
        "link-all-js-and-json": linkAllJSSCript,

        "ncu-update": "ncu -u",
        "reinstall": "pnpm install",
        "update-packages":"run-s -ns ncu-update reinstall",
        
        "module-gen": "thingy-module-gen --",
        "sync-allmodules": "thingy-allmodules-sync",
        "add-module": "run-s -ns \"module-gen {*}\" sync-allmodules --",

        "sourcemodulecreate": "cd sources/source && thingymodulecreate",
        "use-sub-sourcemodule": "run-s \"sourcemodulecreate submodule,{1},use,{2}\"  --",
        "merge-sub-sourcemodule": "run-s -ns  \"sourcemodulecreate submodule,{1},merge,{2}\"  --",
        "merge-dir-sourcemodule": "run-s -ns  \"sourcemodulecreate directory,{1},merge,{2}\"  --",    
        "sourcemodule-to-sub": "run-s \"sourcemodulecreate submodule,{1}\" --",
        "sourcemodule-to-dir": "run-s \"sourcemodulecreate directory,{1}\" --",

        "push": "thingysync push --message",
        "pull": "thingysync pull",

        "postinstall": "pnpm run initialize-thingy"

    }
}

const getRepository = (remoteURL) => {
    return {
        "type": "git",
        "url": "git+" + remoteURL + ".git"  
    }
}

const getBugs = (remoteURL) => {
    return {
        "url": remoteURL + "/issues"
    }
}

const getHomepage = (remoteURL) => {
    return remoteURL + "#readme"
} 

const getBaseDependencies = ()  => {
    return {
        "coffeescript": "^2.7.0",
        "livescript": "^1.6.0",
        "npm-check-updates": "^19.3.0",
        "npm-run-all": "^4.1.5",
        "thingy-allmodules-sync": "^0.2.0",
        "thingy-module-gen": "^0.1.6",
        "thingymodulecreate": "^0.1.8",
        "thingysync": "^0.1.2",
        "thingy-debug": "^0.0.1"
    }
}

const getDescription = () => {
    return "This is the description :-)"
}

//#endregion

//############################################################
module.exports = {
    getBase: () => {
        const name = getThingyName()
        const remoteURL = getThingyRemote()
        const version = stdInitialVersion
        const description = getDescription()
        const scripts = getBaseScripts()
        const repository = getRepository(remoteURL)
        const author = stdAuthor
        const license = stdLicense
        const bugs = getBugs(remoteURL)
        const homepage = getHomepage(remoteURL)
        const dependencies = getBaseDependencies()
        const type = "module"
        return {
            name,
            version,
            description,
            scripts,
            repository,
            author,
            license,
            bugs,
            homepage,
            dependencies,
            type
        }
    }
}