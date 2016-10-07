'use strict';
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

var mainWindow, insertWindow;

function createInsertWindow() {
    insertWindow = new BrowserWindow({
        width: 640,
        height: 480,
        center: true,
        show: false,
    });

    insertWindow .loadURL('file://' + __dirname + '/windows/insert/insert.html');
    insertWindow.on('closed', function() {
        insertWindow = null;
    })
}

app.on('ready', function() {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        width: width * .8,
        height: height * .8,
        // icon: __dirname + '/img/bap.png',
        nodeIntegration: false,
        frame: false,
        title: 'Link',
        center: true
    });

    mainWindow.loadURL('file://' + __dirname + '/windows/main/main.html')
    mainWindow.openDevTools();
})

console.log("IPCMAIN ON");
ipcMain.on('toggle-insert-view', function() {
    console.log("IPC TOGGLE");
    if (!insertWindow) {
        createInsertWindow()
    }

    return (insertWindow.isVisible()) ? insertWindow.hide() : insertWindow.show();
});