const {app, BrowserWindow, ipcMain, protocol} = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
let mainWindow = null;
let projectorWindow = null;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.on("closed", () => {
        if (projectorWindow)
            projectorWindow.close();
    })
    // mainWindow.webContents.openDevTools();
};

ipcMain.on("projector-window", (event) => {
    if (projectorWindow) {
        projectorWindow.close();
        projectorWindow = null;
        event.reply("projector-window-state", "closed");
        return true;
    }
    projectorWindow = new BrowserWindow({
        frame: false,
        fullscreenable: true,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false,
        }
    });
    projectorWindow.loadFile(`${__dirname}/projector/index.html`);
    projectorWindow.on("close", () => projectorWindow = null);
    event.reply("projector-window-state", "opened");
    return true;
})

ipcMain.on("run-projector", () => {
    if (!projectorWindow)
        return false;
    projectorWindow.webContents.executeJavaScript(`cycle();`);
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
