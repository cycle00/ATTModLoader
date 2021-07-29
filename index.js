const { app, BrowserWindow, ipcMain, Menu } = require("electron");

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 980,
        height: 550,
        //icon: TODO,
        title: 'ATT Mod Loader',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        },
        backgroundColor: '#171614'
    });

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