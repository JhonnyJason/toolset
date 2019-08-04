#!/usr/bin/env node
var fs = require('fs');
var mustache = require('mustache');
var machineConfig = require("../../../sources/machine-config");

console.log("check config before we start: ");
console.log(JSON.stringify(machineConfig));

var webhookHandlerConfigContent = {}

initializeOuterConfig();
extractConfig();
writeWebhookHandlerConfigFile();
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

    webhookHandlerConfigContent.secret = machineConfig.webhookSecret;
    webhookHandlerConfigContent.port = machineConfig.webhookPort;
    webhookHandlerConfigContent.repositories = [];
}

function extractConfig() {
    console.log("separateConfig")
    var repositories = machineConfig.repositories; 
    var index = 1;
    for (var repo in repositories) {
        addWebhookHandlerConfigEntry(repo, index)
        index++;    }
}

function writeWebhookHandlerConfigFile() {
    console.log("writeWebhookHandlerConfigFile")
    console.log(JSON.stringify(webhookHandlerConfigContent))
    configTemplate = fs.readFileSync("sources/templates/config-template.mustache", {encoding:"utf-8"});
    console.log("config template:")
    console.log(configTemplate);
    console.log("- - - - - ")
    configFile = mustache.render(configTemplate, webhookHandlerConfigContent);
    console.log("config.js")
    console.log(configFile)
    console.log("- - - - - ")
    fs.writeFileSync("output/webhook-handler-config.js", configFile)
}

function addWebhookHandlerConfigEntry(repoName, index) {
    console.log("addWebhookHandlerConfigEntry")
    repository = {}
    repository.configLine = (index == 1)? "":",";
    repository.configLine += '"' + repoName + '":"' + index + '\\n"'
    webhookHandlerConfigContent.repositories.push(repository)
}