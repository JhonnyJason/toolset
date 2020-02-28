#!/usr/bin/env node
//############################################################
//#region requirements
var fs = require('fs');
var mustache = require('mustache');
var machineConfig = require("../../../sources/machine-config");

// console.log("check config before we start: ");
// console.log(JSON.stringify(machineConfig));
//#endregion

//############################################################
//#region variables
var webhookHandlerConfigContent = {}
var branchMap = {}
var commanderScriptContent = {}
commanderScriptContent.commands = []
//#endregion

//############################################################
initializeOuterConfig();

extractConfig();
writeTemplateFiles();

console.log("all Done!")

//############################################################
//#region helperFunctions
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
        addCommanderSection(thingy, index)
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

//############################################################
//#region forWebhookHandler
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
//#endregion

//############################################################
//#region forCommander
function addCommanderSection(thingy, index) {
    // console.log("addCommanderSection")
    updateCode = retrieveUpdateCode(thingy)

    command = {};
    command.index = index;
    command.codeLines = []
    for(var i = 0; i < updateCode.length; i++) {
        command.codeLines.push({codeLine: updateCode[i]})
    }
    commanderScriptContent.commands.push(command)
}

function retrieveUpdateCode(thingy) {
    var updateCode = []
    if(!thingy.updateCode)
        injectDefaultUpdateCode(thingy)

    updateCode = getRealUpdateCode(thingy)
    return updateCode
}

function getRealUpdateCode(thingy) {
    var finalCode = []
    
    var codeLines = thingy.updateCode
    if(!codeLines) { return }

    for(var i = 0; i < codeLines.length; i++) {
        let line = codeLines[i]
        if(line.length < 13) { 
            finalCode.push(...(expandDefaultCommandShortage(line, thingy)))
        } else { // everything longer is definately not a shortage for a default Command
            finalCode.push(line)
        }
    }
    return finalCode
}

function expandDefaultCommandShortage(line, thingy) {
    if (line == "pull") {
        return pullCommands(thingy)
    }

    if (line == "restart") {
        return restartCommands(thingy)
    }

    if (line == "websiteSync") {
        return websiteSyncCommands(thingy)
    }

    if (line == "update") {
        return installerUpdateCommands(thingy)
    }

    return [line]
    
}

function injectDefaultUpdateCode(thingy) {
    if (thingy.type == "service" && thingy.oneshot) {
        thingy.updateCode = ["pull"]
        return
    }
    if (thingy.type == "service") {
        thingy.updateCode = ["pull", "restart"]
        return
    }
    if (thingy.type == "website") {
        thingy.updateCode = ["pull", "websiteSync"]
        return
    }
    if (thingy.type == "installer") {
        thingy.updateCode = ["update"]
        return
    }
}
//############################################################
//#region defaultCommandLines
function pullCommands(thingy) {
    var cmd = ""
    cmd += "sudo -u "+thingy.homeUser+" -H sh -c '"
    cmd += "cd /home/"+thingy.homeUser+"/"+thingy.repository+";"
    cmd += "git pull origin "+thingy.branch+";';"
    return [cmd]
}

function restartCommands(thingy) {
    var cmd = ""
    cmd += "systemctl restart "+thingy.homeUser+";"
    return [cmd]
}

function installerUpdateCommands(thingy) {
    var cmd = ""
    cmd += "cd /root/"+thingy.repository+";"
    cmd += "git pull origin "+thingy.branch+";"
    cmd += "/usr/bin/node installer.js update;"
    return [cmd]
}

function websiteSyncCommands(thingy) {
    var rsyncCmd = "rsync "
    rsyncCmd += "/home/"+thingy.homeUser+"/"+thingy.repository+"/ "
    rsyncCmd += "/home/"+thingy.homeUser+"/document-root/ "
    rsyncCmd += '--delete --recursive --exclude=".git";'

    var gzipCmd = "gzip -rfk "
    gzipCmd += "/home/"+thingy.homeUser+"/document-root/*;"

    return [rsyncCmd, gzipCmd]
}

//#endregion

//#endregion

//#endregion