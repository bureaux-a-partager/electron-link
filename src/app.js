'use strict';
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

var mainWindow, insertWindow, settingWindow;

function createInsertWindow() {
    insertWindow = new BrowserWindow({
        width: 640,
        height: 480,
        center: true,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        frame: false,
    });

    insertWindow .loadURL('file://' + __dirname 
    + '/windows/insert/insert.html');
    insertWindow.openDevTools();
    insertWindow.on('closed', function() {
        insertWindow = null;
    })
}

function createSettingWindow() {
    settingWindow = new BrowserWindow({
        width: 640,
        height: 480,
        center: true,
        show: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        frame: false,
    });

    settingWindow .loadURL('file://' + __dirname 
    + '/windows/settings/setting.html');
    settingWindow.on('closed', function() {
        settingWindow = null;
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

ipcMain.on('toggle-add-url-view', function() {
    if (!insertWindow) {
        createInsertWindow()
    }

    return (insertWindow.isVisible()) ? insertWindow.hide() : insertWindow.show();
});


ipcMain.on('toggle-setting-view', function() {
    if (!settingWindow) {
        createSettingWindow()
    }

    return (settingWindow.isVisible()) ? settingWindow.hide() : settingWindow.show();
});