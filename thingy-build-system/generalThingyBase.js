const pathModule = require("path")

const stdAuthor = "Lenard Frommelt"
const stdRepoBase = "https://github.com/JhonnyJason"
const stdInitialVersion = "0.0.1"
const stdLicense = "Unlicense"

const coffeeSource = "sources/source/*/*.coffee"
const jsDest = "toolset/compiled/js/"


const getThingyName = () => {
    var cwd = process.cwd()
    console.log("getBase in cwd: " + cwd)
    var directoryChain = cwd.split(pathModule.sep)
    if(directoryChain.length < 2) {
        throw new Error("Unexpected cwd: " + cwd + "\n Too small path depth!")
    } else if(directoryChain[directoryChain.length - 1] != "toolset") {
        throw new Error("Unexpected cwd: " + cwd + "\n the last directory is not 'toolset'")
    }

    return directoryChain[directoryChain.length - 2]
} 

const getBaseScripts = (name) => {
    return {
        "build-coffee": "coffee -o " + jsDest + " -c " + coffeeSource,
        "watch-coffee": "coffee -o " + jsDest + " -cw " + coffeeSource,
        "postinstall": "npm run initialize-thingy"  
    }
}

const getRepository = (name) => {
    return {
        "type": "git",
        "url": "git+" + stdRepoBase + "/" + name + ".git"  
    }
}

const getBugs = (name) => {
    return {
        "url": stdRepoBase + "/" + name + "/issues"
    }
}

const getHomepage = (name) => {
    return stdRepoBase + "/" + name + "#readme"
} 

const getBaseDependencies = ()  => {
    return {
        "coffeescript": "^2.3.2",
        "npm-run-all": "^4.1.5"  
    }
}

const getDescription = () => {
    return "This is the shit!"
}


module.exports = {
    getBase: () => {
        const name = getThingyName()
        const version = stdInitialVersion
        const description = getDescription()
        const scripts = getBaseScripts()
        const repository = getRepository(name)
        const author = stdAuthor
        const license = stdLicense
        const bugs = getBugs(name)
        const homepage = getHomepage(name)
        const dependencies = getBaseDependencies()
        
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
            dependencies
        }
    }
}