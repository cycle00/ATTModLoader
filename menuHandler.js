const $ = require('jquery');
const { remote } = require('electron');

var win = remote.getCurrentWindow();

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