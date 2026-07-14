#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
const sourceHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/js")
const bundlePath = pathModule.resolve(process.cwd(), "toolset/build/bundles")


function writeUnlessExists(path, file) {
    if(!fs.existsSync(path)) { fs.writeFileSync(path, file) }
}

function syncOptions(opts, path) {
    // we want to write opts which are the default options
    // but we could already have specific options
    var specOpts = {}
    try { specOpts = require(path) } catch (err) {}

    // reflect the contents of specOpts in opts - potentially overwrite defaults
    Object.assign( opts, specOpts )

    // if the synced opts are alrady our specOpts there is nothing to do
    if(JSON.stringify(opts) !== JSON.stringify(specOpts)) {
        //otherwise write the file
        fs.writeFileSync(path, JSON.stringify(opts, null, 4))
    }
}



//default dev options
const defaultDevOptions = require("./default-dev-options.json")
const devOptionsPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev-options.json")
syncOptions(defaultDevOptions, devOptionsPath)


//default production options
const defaultProductionOptions = require("./default-production-options.json")
const productionOptionsPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-production-options.json")
syncOptions(defaultProductionOptions, productionOptionsPath)


//scripts
const productionMJS = `
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-all.json" with { type: "json" };
import options from "./esbuild-production-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const productionScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-production.mjs")
writeUnlessExists(productionScriptPath, productionMJS)


const devMJS =`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-all.json" with { type: "json" };
import options from "./esbuild-dev-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const devScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev.mjs")
writeUnlessExists(devScriptPath, devMJS)


const workerMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-worker.json" with { type: "json" };
import options from "./esbuild-production-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const workerScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev.mjs")
writeUnlessExists(workerScriptPath, workerMJS)


const devWorkerMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-worker.json" with { type: "json" };
import options from "./esbuild-dev-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const devWorkerScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev.mjs")
writeUnlessExists(devWorkerScriptPath, devWorkerMJS)


const watchWorkerMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-worker.json" with { type: "json" };
import addedOpts from "./esbuild-dev-options.json" with { type: "json" }

const options = { ...base, entryPoints, ...addedOpts }

const ctx = await esbuild.context(options)
await ctx.watch()
`
const watchWokerScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev.mjs")
writeUnlessExists(watchWokerScriptPath, watchWorkerMJS)


const watchAllMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-all.json" with { type: "json" };
import addedOpts from "./esbuild-dev-options.json" with { type: "json" }

const options = { ...base, entryPoints, ...addedOpts }

const ctx = await esbuild.context(options)
await ctx.watch()
`
const watchAllScriptPath = pathModule.resolve(process.cwd(), ".build-config/esbuild-dev.mjs")
writeUnlessExists(watchAllScriptPath, watchAllMJS)


// TODO write out entries.json and per page watch and dev scripts
const heads = fs.readdirSync(headsPath)
const jsHeads = (heads).map(head => head + ".js")
var entries = {}
for(var i = 0; i < heads.length; i++) {
    entries[heads[i]] = pathModule.resolve(sourceHeadsPath, jsHeads[i])
}

console.log(JSON.stringify(entries, null, 4))





// function writeIndividualConfigFiles() {
//     let heads = Object.keys(entries)
//     for(let i = 0; i < heads.length; i++) {
//         writeIndividualDevConfig(heads[i], entries[heads[i]])
//         writeIndividualWatchConfig(heads[i], entries[heads[i]])
//     }
// }

// function writeIndividualDevConfig(head, entry) {
//     let config = Object.assign({}, devConfig)
//     config.entry = {}
//     config.entry[head] = entry

//     const configString = exportsString + JSON.stringify(config, null, 4)

//     const filename = "webpack-dev-"+head+".config.js"
//     const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

//     fs.writeFileSync(configPath, configString)    

// }

// function writeIndividualWatchConfig(head, entry) {
//     let config = Object.assign({}, watchConfig)
//     config.entry = {}
//     config.entry[head] = entry

//     const configString = exportsString + JSON.stringify(config, null, 4)

//     const filename = "webpack-watch-"+head+".config.js"
//     const configPath = pathModule.resolve(process.cwd(), ".build-config", filename)

//     fs.writeFileSync(configPath, configString)    

// }

// writeIndividualConfigFiles()
