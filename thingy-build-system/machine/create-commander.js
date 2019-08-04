#!/usr/bin/env node
var fs = require('fs');
var mustache = require('mustache');
var machineConfig = require("../../../sources/machine-config");

console.log("check config before we start: ");
console.log(JSON.stringify(machineConfig));

var commanderScriptContent = {}
commanderScriptContent.commands = []

initializeOuterConfig();

extractConfig();
writeCommanderScriptFile();
console.log("all Done!")

//============================================================
// helper functions
//============================================================
function initializeOuterConfig() {
    var now = new Date();
    
    var day = now.getDate()
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var today = "" + day + "." + month + "." + year;
    
    commanderScriptContent.today = today;
}

function extractConfig() {
    console.log("extractConfig")
    var repositories = machineConfig.repositories; 
    var index = 1;
    for (var repo in repositories) {
        addCommanderSection(index, repositories[repo])
        index++;
    }
}

function writeCommanderScriptFile() {
    console.log("writeCommanderScriptFile")
    console.log(JSON.stringify(commanderScriptContent))
    console.log("- - - - - ")
    commanderTemplate = fs.readFileSync("sources/templates/commander-template.mustache", {encoding:"utf-8"});
    console.log("commander template:")
    console.log(commanderTemplate);
    console.log("- - - - - ")
    commanderFile = mustache.render(commanderTemplate, commanderScriptContent);
    console.log("commander.pl")
    console.log(commanderFile)
    console.log("- - - - - ")
    fs.writeFileSync("output/commander.pl", commanderFile)
}

function addCommanderSection(index, shellCodeLines) {
    console.log("addCommanderSection")
    command = {};
    command.index = index;
    command.codeLines = []
    for(var i = 0; i < shellCodeLines.length; i++) {
        command.codeLines.push({codeLine: shellCodeLines[i]})
    }
    commanderScriptContent.commands.push(command)
}