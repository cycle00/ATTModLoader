const $ = require('jquery');
const { remote } = require('electron');
var dialog = require('electron').remote.dialog;
const fs = require('fs');
const path = require('path');

var win = remote.getCurrentWindow();
let folderPath;

let options = {
    // See place holder 1 in above image
    title : "Choose Game Directory", 
    
    // See place holder 2 in above image
    defaultPath : "C:",
    
    // See place holder 3 in above image
    buttonLabel : "Select Folder",
    
    properties: ["openDirectory"]
   }

document.getElementById("chooseFolder").onclick = async function() {
    folderPath = await dialog.showOpenDialog(options);
    document.getElementById("pathText").style.visibility = "visible";
    document.getElementById("confirmButton").style.visibility = "visible";
    document.getElementById("pathDisplay").style.visibility = "visible";
    console.log(folderPath);
    document.getElementById("pathDisplay").innerHTML = folderPath.filePaths[0];
};

document.getElementById("confirmButton").onclick = async function() {
    fs.writeFile('gameDirectory.txt', folderPath.filePaths[0], function (err) {
        if(err) return console.log(err);
        win.loadFile(path.join(__dirname, 'index.ejs'));
    })
};

document.getElementById("frameButton_minimize").onclick = function() {
    win.minimize();
};

document.getElementById("frameButton_restoredown").onclick = function() {
    if(!win.isMaximized()) {
        win.maximize();
    } else {
        win.unmaximize();
    }
};

document.getElementById("frameButton_close").onclick = function() {
    win.close();
};