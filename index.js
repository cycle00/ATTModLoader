const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { pathExists } = require("fs-extra");
const path = require('path');
const url = require('url');
const ejse = require('ejs-electron')
const fs = require('fs');

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 730,
        'minHeight': 730,
        'minWidth': 1280,
        frame: false,
        //icon: TODO,
        title: 'ATT Mod Loader',
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        },
        backgroundColor: '#212121'
    });

    fs.access('./gameDirectory.txt', fs.F_OK, (err) => {
        if (err) {
            win.loadFile(path.join(__dirname, 'setup.ejs'));
            return;
        }
        fs.readFile('./gameDirectory.txt', 'utf8', function(err, data) {
            if (err) throw err;
            if (data == "")
               win.loadFile(path.join(__dirname, 'setup.ejs'));
            else
                win.loadFile(path.join(__dirname, 'index.ejs'));
        });
    })

    win.resizable = true;
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

