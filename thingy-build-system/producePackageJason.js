#!/usr/bin/env node
const fs = require("fs").promises

const generalThingyBase = require("./generalThingyBase")
const specificThingyInfo = require("./specificThingyInfo")

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}


const delayPromise = (timeMS) => {
    return new Promise((resolve) => { setTimeout(resolve, timeMS) })
}
const producePackageJason = async () => {
    console.log("not producing anything ;-)")
    console.log("sourceInfo is: " + sourceInfo)
    await delayPromise(3000)
    console.log("Waited 3 seconds!")
    //read name and type
    // var promises = []

    // promises.push()
    
    //
}

producePackageJason()