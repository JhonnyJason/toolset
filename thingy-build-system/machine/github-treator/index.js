/**
 * Created by lenny on 24.8.2018
 */

require('systemd')
var fs = require('fs');
var githubAPI = require('github-api');
const net = require('net');
var config = require('./default-config');
try{
    config = require('./config');
} catch(ex) {
    console.log('caught: ' + ex);
    console.log('This most likely means that you do not have a real config.js file');
}

console.log('check config before we start:');
console.log(JSON.stringify(config));

var accessAPI = new githubAPI({
    username: config.username,
    token: config.token
})

// init shit - - - - - - - - - - - - - - - - - - - - - - - -
const server = net.createServer((c) => {
    // 'connection' listener
    console.log('client connected');
    c.on('end', () => {
      console.log('client disconnected');
    });
    c.on('data', async (d) => {
        var str = d.toString("utf8")

        console.log("received Data: " + str)
        process.exit(0);
        var wasCommand = await executeCommand(str)
        if(wasCommand)
            c.write("received a command :-)\n")            
        else
            c.write("unknown command!\n")
        process.exit(0);
    });
    c.write('hello! How may I help you?\n');
  });
  server.on('error', (err) => {
    throw err;
  });
server.listen('systemd')
// test shit - - - - - - - - - - - - - - - - - - - - - - - -
// addDeployKey("machine-github-treator", "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCog1zrPBoUVRHq/ti4iG+5LbLzjO0WTwkypOaBhdzdOvKL8xtCGWOMqDWdi7CQiMQAE5zFyLFGfqxoq3O0tqPPVJx70YvlowNlBJiOe6nAh0oFjzQnwSvfVSzdWT7FcYYWpr1LoQZduwRhHw72zHr2NYqW3pY1o7fZDjSoHUD08iiHPvsXacvWXxfecLRCDoDtjpjx1B+caMJhP/pN9eNTKW1vQagrHfUVCbL2bJRCaEWaUCyRLp9Ai6GE2MyGv/na+LwZsnUbwsQhM9tWTcWYMMLI2QEd15WQkr0+aTz8sMYJpgWcjnAvA9ETEbkA3a3NXR9BiOsJAopyaT3S+87V", "testKey")

// functions - - - - - - - - - - - - - - - - - - - - - - - -





function addDeployKeyCallback(arg1, arg2) {
    console.log("addDeployKeyCallback");
    console.log(JSON.stringify(arg1));
    console.log(JSON.stringify(arg2));
}



async function addDeployKey (repo, key, title) {
    console.log("addDeployKey")
    repository = accessAPI.getRepo(config.username, repo)
    keyDescription = {      
        "title": title,
        "key": key,
        "read_only": true  
    }
    var result = await repository.createKey(keyDescription, addDeployKeyCallback);
    console.log(JSON.stringify(result))
}




async function evaluateCommandTokens(tokens) {
    console.log(evaluateCommandTokens);
    switch(token[0]) {
        case "addDeployKey":
            if(tokens.length != 3) 
                return false;
            await addDeployKey(tokens[1], tokens[2], tokens[3])
        default:
            return false;
    }

}

async function executeCommand(command) {
    console.log("executeCommand")
    console.log(command)
    var commandEnd = command.indexOf('\n')
    if (commandEnd > 0) {
        var new_command = command.slice(0, commandEnd)
        tokens = new_command.split(" ");
        return await evaluateCommandTokens(tokens)
    } else { return false; }  

}