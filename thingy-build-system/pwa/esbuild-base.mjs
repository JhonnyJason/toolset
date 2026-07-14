import path from "node:path";
import { fileURLToPath } from 'node:url';

// this file sits in (path/to/projectroot/toolset/thingy-buid-system/pwa/filename.mjs)
const thingyRoot = path.dirname(path.resolve(fileURLToPath(import.meta.url), '../../..'))
console.log('thingyRoot: '+thingyRoot)

export default {
    absWorkingDir: thingyRoot,
    bundle: true,
    
    platform: "browser",
    target: "esnext",

    // format: "iife", 
    // iife = immidediately invoked function expression - default when browser + bundle
    
    
    logLevel: "info"
}


// for service
// export default {
//     absWorkingDir: thingyRoot,
//     bundle: true,
    
//     platform: "node", // relevant for the bundling - controls imports and built-ins
//     target: "esnext", // 
//     target: "node26", // maybe better to specify latest runtime
//     format: "esm" // option to also use "cjs", but for now we do ESM only

// For Deno
//     platform: "neutral",
//     target: "esnext", // save for Deno
//     format: "esm",

//     logLevel: "info"
// }