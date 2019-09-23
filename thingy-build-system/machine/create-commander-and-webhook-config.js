#!/usr/bin/env node
var fs = require('fs');
var mustache = require('mustache');
var machineConfig = require("../../../sources/machine-config");

// console.log("check config before we start: ");
// console.log(JSON.stringify(machineConfig));

var webhookHandlerConfigContent = {}
var branchMap = {}
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
    webhookHandlerConfigContent.secret = machineConfig.webhookSecret;
    webhookHandlerConfigContent.port = machineConfig.webhookPort;
    webhookHandlerConfigContent.uri = machineConfig.uri;
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
    generateWebhookHandlerConfigContent()
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
    fs.writeFileSync("output/webhook-config.json", configFile)
    fs.writeFileSync("output/commander.pl", commanderFile)
}

function addWebhookHandlerConfigEntry(thingy, index) {
    // console.log("addWebhookHandlerConfigEntry")
    var repo = thingy.repository
    if(!branchMap[repo]) {
        branchMap[repo] = {
            indices: [],
            branches: []

        }
    }

    var repoObject = branchMap[repo]

    repoObject.indices.push(index)
    repoObject.branches.push(thingy.branch)

}

function generateWebhookHandlerConfigContent() {
    var keys = Object.keys(branchMap)

    keys.forEach(key => {
        generateWebhookHandlerConfigLine(key, branchMap[key])
    });
}

function generateWebhookHandlerConfigLine(key, contentObject) {
    var repository = {
        configLine: "",
        branchLine: ""
    }
    if (contentObject.indices[0] != 1) {
        repository.configLine += ","
        repository.branchLine += ","
    }
    var indices = JSON.stringify(contentObject.indices)
    var branches = JSON.stringify(contentObject.branches)

    repository.configLine += '"' + key + '":' + indices
    repository.branchLine += '"' + key + '":' + branches 

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