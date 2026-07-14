#!/usr/bin/env node
const pathModule = require("path")
const fs = require("fs")

function olog(obj) {
    console.log(JSON.stringify(obj, null, 4))
}

const headsPath = pathModule.resolve(process.cwd(), "sources/page-heads")
const sourceHeadsPath = pathModule.resolve(process.cwd(), "toolset/build/js")
const configDir = pathModule.resolve(process.cwd(), ".build-config")

const bundlePath = pathModule.resolve(process.cwd(), "toolset/build/bundles")

function writeUnlessExists(path, file) {
    if(!fs.existsSync(path)) { fs.writeFileSync(path, file) }
    else {
        console.log("file already existed - skipping write: "+path)
    }
}

function writeUnlessEqual(path, file) {
    if (fs.existsSync(path)) {
        const current = fs.readFileSync(path, { encoding: "utf8" })
        if (file === current) {
            console.log("file exists with equal content - skipping write: "+path)
            return
        }
    }
    fs.writeFileSync(path, file)
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
    } else {
        console.log("options already up-to-date - skipping write: "+path)
    } 
}



//default dev options
const defaultDevOptions = require("./default-dev-options.json")
const devOptionsPath = pathModule.resolve(configDir, "esbuild-dev-options.json")
syncOptions(defaultDevOptions, devOptionsPath)


//default production options
const defaultProductionOptions = require("./default-production-options.json")
const path = require("path")
const productionOptionsPath = pathModule.resolve(configDir, "esbuild-production-options.json")
syncOptions(defaultProductionOptions, productionOptionsPath)


//scripts
const productionMJS = `
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-all.json" with { type: "json" };
import options from "./esbuild-production-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const productionScriptPath = pathModule.resolve(configDir, "esbuild-production.mjs")
writeUnlessExists(productionScriptPath, productionMJS)


const devMJS =`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-all.json" with { type: "json" };
import options from "./esbuild-dev-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const devScriptPath = pathModule.resolve(configDir, "esbuild-dev.mjs")
writeUnlessExists(devScriptPath, devMJS)


const workerMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-worker.json" with { type: "json" };
import options from "./esbuild-production-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const workerScriptPath = pathModule.resolve(configDir, "esbuild-worker.mjs")
writeUnlessExists(workerScriptPath, workerMJS)


const devWorkerMJS=`
import * as esbuild from 'esbuild'
import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

import entryPoints from "./entries-worker.json" with { type: "json" };
import options from "./esbuild-dev-options.json" with { type: "json" }

await esbuild.build({ ...base, entryPoints, ...options })
`
const devWorkerScriptPath = pathModule.resolve(configDir, "esbuild-dev-worker.mjs")
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
const watchWokerScriptPath = pathModule.resolve(configDir, "esbuild-watch-worker.mjs")
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
const watchAllScriptPath = pathModule.resolve(configDir, "esbuild-watch-all.mjs")
writeUnlessExists(watchAllScriptPath, watchAllMJS)





//============================================================
// individual scripts
function writeIndividualDevScript(head, entry) {
    const mjs =`
    import * as esbuild from 'esbuild'
    import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

    import options from "./esbuild-dev-options.json" with { type: "json" }
    const entryPoints = ["${entry}"]

    await esbuild.build({ ...base, entryPoints, ...options })
    `
    const filename = "esbuild-dev-"+head+".mjs"
    const path = pathModule.resolve(configDir, filename)

    writeUnlessExists(path, mjs)
}

function writeIndividualWatchScript(head, entry) {
    const mjs =`
    import * as esbuild from 'esbuild'
    import base from '../toolset/thingy-build-system/pwa/esbuild-base.mjs'

    import addedOpts from "./esbuild-dev-options.json" with { type: "json" }
    const entryPoints = ["${entry}"]

    const options = { ...base, entryPoints, ...addedOpts }

    const ctx = await esbuild.context(options)
    await ctx.watch()
    `
    const filename = "esbuild-watch-"+head+".mjs"
    const path = pathModule.resolve(configDir, filename)

    writeUnlessExists(path, mjs)
}

//============================================================
const heads = fs.readdirSync(headsPath)
const jsHeads = (heads).map(head => head + ".js")
var entries = []
for(var i = 0; i < heads.length; i++) {
    let entryPath = pathModule.join("toolset/build/js", jsHeads[i])
    entries.push(entryPath)
    writeIndividualDevScript(heads[i], entryPath)
    writeIndividualWatchScript(heads[i], entryPath)
}
// entries-all.json
const entriesFile = JSON.stringify(entries, null, 4)
const entriesPath = pathModule.resolve(configDir, "entries-all.json")
writeUnlessEqual(entriesPath, entriesFile)

//============================================================
const jss = fs.readdirSync(sourceHeadsPath)
const workers = []
for(var i = 0; i < jss.length; i++) {
    if(jss[i].endsWith("worker.js")) {
        let name = jss[i].slice(0, jss[i].length - 3)
        workers.push(pathModule.join("toolset/build/js", jss[i]))
    }
}
const workerEntriesFile = JSON.stringify(workers, null, 4)
const workerEntriesPath = pathModule.resolve(configDir, "entries-worker.json")
// entries-worker.json
writeUnlessEqual(workerEntriesPath, workerEntriesFile)
