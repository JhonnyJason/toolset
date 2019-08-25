#!/usr/bin/env node
var fs = require('fs');
var mustache = require('mustache');
var machineConfig = require("../../../sources/machine-config");

// console.log("check config before we start: ");
// console.log(JSON.stringify(machineConfig));

var webhookHandlerConfigContent = {}
var commanderScriptContent = {}
commanderScriptContent.commands = []

initializeOuterConfig();

extractConfig();
writeTemplateFiles();
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
    
    webhookHandlerConfigContent.today = today;
    commanderScriptContent.today = today;

    webhookHandlerConfigContent.secret = machineConfig.webhookSecret;
    webhookHandlerConfigContent.port = machineConfig.webhookPort;
    webhookHandlerConfigContent.repositories = [];
}

function extractConfig() {
    // console.log("extractConfig")
    var thingies = machineConfig.thingies; 
    
    for (var index = 1; index < (thingies.length + 1); index++) {
        var thingy = thingies[index - 1]
        // console.log(JSON.stringify(thingy, null, 2))
        addWebhookHandlerConfigEntry(thingy, index)
        addCommanderSection(thingy.updateCode, index)
    }
}

function writeTemplateFiles() {
    // console.log("writeTemplateFiles")
    // console.log(JSON.stringify(webhookHandlerConfigContent))
    // console.log(JSON.stringify(commanderScriptContent))
    configTemplate = fs.readFileSync("sources/templates/config-template.mustache", {encoding:"utf-8"});
    // console.log("config template:")
    // console.log(configTemplate);
    // console.log("- - - - - ")
    commanderTemplate = fs.readFileSync("sources/templates/commander-template.mustache", {encoding:"utf-8"});
    // console.log("commander template:")
    // console.log(commanderTemplate);
    // console.log("- - - - - ")
    configFile = mustache.render(configTemplate, webhookHandlerConfigContent);
    // console.log("config.js")
    // console.log(configFile)
    // console.log("- - - - - ")
    commanderFile = mustache.render(commanderTemplate, commanderScriptContent);
    // console.log("commander.pl")
    // console.log(commanderFile)
    // console.log("- - - - - ")
    fs.writeFileSync("output/webhook-handler-config.js", configFile)
    fs.writeFileSync("output/commander.pl", commanderFile)
}

function addWebhookHandlerConfigEntry(thingy, index) {
    // console.log("addWebhookHandlerConfigEntry")
    repository = {}
    repository.configLine = (index == 1)? "":",";
    repository.configLine += '"' + thingy.repository + '":"' + index + '\\n"'
    repository.branchLine = (index == 1)? "":",";
    repository.branchLine += '"' + thingy.repository + '":"' + thingy.branch + '"'
    webhookHandlerConfigContent.repositories.push(repository)
}

function addCommanderSection(updateCode, index) {
    // console.log("addCommanderSection")
    command = {};
    command.index = index;
    command.codeLines = []
    for(var i = 0; i < updateCode.length; i++) {
        command.codeLines.push({codeLine: updateCode[i]})
    }
    commanderScriptContent.commands.push(command)
}