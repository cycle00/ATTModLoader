const $ = require('jquery');
const { remote } = require('electron');
var dialog = remote.dialog;
var shell = remote.shell;
const path = require('path');
const fs = require('fs-extra');
const unzipper = require('unzipper');


function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}

var gamePath;

fs.readFile('./gameDirectory.txt', 'utf8', function(err, data) {
    if (err) throw err;
    gamePath = data;
    var pluginFolders = getDirectories(path.join(data, 'BepInEx\\plugins\\'));
    let table = document.getElementById("modlist");
    reloadModList(pluginFolders, table, data);
});


var win = remote.getCurrentWindow();

function reloadModList(pluginFolders, table, data) {
    for(var i = 0; i < table.rows.length; i++) {
        if(i == 0)
            continue;
        else {
            table.deleteRow(i);
        }
    }
    for(var i = 0; i < pluginFolders.length; i++) {
        let modInfo = fsReadFileSynchToArray(path.join(data, 'BepInEx\\plugins\\', pluginFolders[i], '\\mod.json'));
        let row = table.insertRow();
        row.classList.add("mod");
        let iconCell = row.insertCell();
        let iconImage = document.createElement("img");
        iconImage.src = path.join(data, 'BepInEx\\plugins\\', pluginFolders[i], '\\', modInfo.icon);
        iconImage.classList.add("modicon");
        iconImage.setAttribute('draggable', false);
        iconCell.appendChild(iconImage);
        let modNameCell = row.insertCell();
        let modNameText = document.createTextNode(modInfo.displayName);
        modNameCell.appendChild(modNameText);
        let modVersionCell = row.insertCell();
        let modVersionText = document.createTextNode(modInfo.version);
        modVersionCell.appendChild(modVersionText);
        let modAuthorCell = row.insertCell();
        let modAuthorText = document.createTextNode(modInfo.author);
        modAuthorCell.appendChild(modAuthorText);
        let deleteCell = row.insertCell();
        let deleteCellButton = document.createElement("button");
        deleteCellButton.innerHTML = "╳";
        deleteCellButton.setAttribute("id", "deleteButton");
        var path2 = data.replace(/\\/g, "//");
        deleteCellButton.setAttribute("onclick", `javascript:DeleteMod("${path2 + "//" + 'BepInEx//plugins//' + pluginFolders[i]}", ${i})`);
        deleteCell.appendChild(deleteCellButton);
    }
}

function DeleteMod(path, id) {
    try {
        fs.rmdirSync(path, { recursive: true });
    
        console.log(`${path} is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }
    var pluginFolders = getDirectories(gamePath + '\\' + 'BepInEx\\plugins\\');
    let table = document.getElementById("modlist");
    table.deleteRow(id + 1);
    console.log(id);
    reloadModList(pluginFolders, table, gamePath);
}

document.getElementById("openModsFolder").onclick = function() {
    fs.readFile('./gameDirectory.txt', 'utf8', function(err, data) {
        if (err) throw err;
        shell.openPath(path.join(data, 'BepInEx\\plugins\\'));
    });
    
}

let options = {
    // See place holder 1 in above image
    title : "Choose Mod Zip", 
    
    // See place holder 2 in above image
    defaultPath : "C:",
    
    // See place holder 3 in above image
    buttonLabel : "Select Mod",
    
    filters: [
        { name: 'Archives', extensions: ['zip'] }
    ],

    properties: ["openFile"]
   }

document.getElementById("installmod").onclick = function() {
    dialog.showOpenDialog(win, options).then(mod => {
        if(mod.canceled)
            return;
        var pathstr = gamePath + '\\' + 'BepInEx\\plugins\\';
        var path2 = pathstr.replace(/\\/g, "/");
        console.log(path2);
        fs.createReadStream(mod.filePaths[0]).pipe(unzipper.Extract({ path: path2 }).on('close', function() {
            var pluginFolders = getDirectories(pathstr);
            let table = document.getElementById("modlist");
            reloadModList(pluginFolders, table, gamePath);
        }));
    });
}

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

function fsReadFileSynchToArray (filePath) {
    var data = JSON.parse(fs.readFileSync(filePath));
    return data;
}
