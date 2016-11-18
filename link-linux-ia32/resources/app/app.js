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
    + '/windows/setting/setting.html');
    settingWindow.openDevTools();
    settingWindow.on('closed', function() {
        settingWindow = null;
    })
}

app.on('ready', function() {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        width: width * .9,
        height: height * .9,
        icon: __dirname + '/img/bap.png',
        nodeIntegration: false,
        frame: false,
        title: 'Link',
        center: true
    });

    mainWindow.loadURL('file://' + __dirname + '/windows/main/main.html')
    mainWindow.openDevTools();

    mainWindow.on('closed', function(){
        mainWindow = null;

        if (settingWindow) {
            settingWindow.close();
            settingWindow = null;
        
        }

        if (insertWindow) {
            insertWindow.close();
            insertWindow = null;
        }
        app.quit();
    });
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

ipcMain.on('sync-urls', function(event, urls) {
    event.returnValue = true;
    mainWindow.webContents.send('main-sync-urls', urls)
});


ipcMain.on('change-subdomain', function(event, url) {
    mainWindow.webContents.send('main-change-subdomain', url);
});
