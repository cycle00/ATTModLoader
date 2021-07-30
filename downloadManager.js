const $ = require('jquery');
const { remote } = require('electron');
var dialog = require('electron').remote.dialog;
const fs = require('fs');
const path = require('path');
const downloadRelease = require('@terascope/fetch-github-release');
var exec = require('child_process').execFile;

var win = remote.getCurrentWindow();

const user = 'BepInEx';
const repo = 'BepInEx';
var outputdir;
fs.readFile('./gameDirectory.txt', 'utf8', function(err, data) {
    if (err) throw err;
    outputdir = data;
});
const leaveZipped = false;
const disableLogging = false;

// Define a function to filter releases.
function filterRelease(release) {
    // Filter out prereleases.
    return release.prerelease === false;
  }
  
  // Define a function to filter assets.
  function filterAsset(asset) {
    // Select assets that contain the string 'windows'.
    return asset.name.includes('x64');
  }


document.getElementById("downloadBep").onclick = async function() {
    document.getElementById("downloadBep").disabled = true;
    downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped, disableLogging)
    .then(function() {
      console.log('All done!');
      document.getElementById("pathText").style.visibility = "visible";
      document.getElementById("pathText").innerHTML = "BepInEx download complete!"
      document.getElementById("confirmButton").style.visibility = "visible";
      document.getElementById("displayText").style.visibility = "visible";
    })
    .catch(function(err) {
      console.error(err.message);
    });
};

document.getElementById("confirmButton").onclick = async function() {
    exec(path.join(outputdir, 'A Township Tale.exe'), function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
        document.getElementById("continueButton").style.visibility = "visible";
        document.getElementById("confirmButton").style.display = "none";
    });  
};

document.getElementById("continueButton").onclick = function() {
    win.loadFile(path.join(__dirname, "index.ejs"));
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