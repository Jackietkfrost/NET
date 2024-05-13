require('update-electron-app')();
const electronInstaller = require('electron-winstaller');
const { app, BrowserWindow, ipcMain, Menu, Notification, IncomingMessage, clipboard, autoUpdater } = require('electron');
const url = require('url');
const path = require('path');
const sysInfo = require('systeminformation');
const updateServer = "net-q96mwxvep-jackietkfrosts-projects.vercel.app";
const updateUrl = `${updateServer}/update/${process.platform}/${app.getVersion()}`;

let userName;
//let uuid = store.get('uuid');
let mainWindow;
const NOTIFICATION_TITLE = 'N.E.T.';

const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
};

var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
        return false;
    }

    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':

            // Optionally do things such as:
            //
            // - Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Always quit when done
            app.quit();

            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Always quit when done
            app.quit();

            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return true;
    }
};

if (handleStartupEvent()) {
    return;
}

//  Do a ternary check to see if the project is in development mode. If in Production, use this function, otherwise do nothing.
//  autoUpdater.setFeedURL({ url })



// Check if storage has uuid, if not, run generateUUID function from userIDGeneration.js
/**
 * Gets the UUID from local storage, and if it's not available, it generates it.
 * Needs to validate itself with some data that identifies who had the UUID first on connection.
 * @returns {string} uuid
 */
function getUUID() {
    //WIP
    // Check 
    if (localStorage.getItem('uuid') === null) {
        uuid = generateUUID();
        localStorage.setItem('uuid', uuid);
    }
    return uuid;
}


//console.log("Generating User ID: ",generateUUID());
// Windows API Section
app.setAppUserModelId('N.E.T.');
function minWindow() {
    mainWindow.minimize();
}
function maxWindow() {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
}
function closeWindow() {
    console.log("Closing window..");
    app.quit();
}
/**
 * Sends Notification to OS. 
 * @param {*} notifEmitter 
 * @param {object} notifContent 
 */
function sendMessageNotif(notifEmitter, notifContent) {
    let notif = new Notification({
        title: NOTIFICATION_TITLE,
        subtitle: notifEmitter,
        body: `${notifEmitter} \n${notifContent}`
    });
    notif.show();
}
function getWinFocus(_event, notifEmitter, notifContent) {
    if (!mainWindow.isFocused()) {
        console.log(notifEmitter);
        sendMessageNotif(notifEmitter, notifContent);
    }
}
ipcMain.on('min-window', minWindow);
ipcMain.on('max-window', maxWindow);
ipcMain.on('close-window', closeWindow);
ipcMain.on('check-if-focused', getWinFocus)
// End Windows API Section

// Peerjs Section

// Peerjs Server Section

// End Peerjs Server Section

// Peerjs Client Section
//ipcMain.on('add-listener')
// End Peerjs Client Section

// End Peerjs Section

// App Variables


function setUsername(_event, name) {
    userName = name;
}
function getUsername() {
    console.log(`Sending username: ${userName}`);
    mainWindow.webContents.send('get-username', userName);
}

function getPeerId() {
    return peerId;
}

ipcMain.on('get-username', getUsername);
ipcMain.on('set-username', setUsername);
// End App Variables

// Main Electron Body

function reloadPage() {
    console.log("Reloading page..");
    mainWindow.reload();
}

async function getPCInfo() {
    try {
        const cpuInfo = await sysInfo.cpu();
        const pcCPU = cpuInfo;
        const serializedData = JSON.stringify(pcCPU);
        console.log(serializedData);
        mainWindow.webContents.send('get-cpu', serializedData);
    } catch (error) {
        console.error(error);
    }
}

function copyText(_event, copiedText) {
    try {
        clipboard.writeText(copiedText);
        console.log(`Copied text: ${copiedText}`);
    }
    catch (err) {
        console.log(err);
    }
}

app.on("ready", function () {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'assets/images/desktop-icon.ico'),
        webPreferences: {
            //nodeIntegration:true,
            //contextIsolation:false,
            preload: path.join(__dirname, 'src/preload.js')
        },
        width: 765,
        height: 550,
        minHeight: 600,
        minWidth: 500,
        frame: false,
        title: "Loading...",
        resizable: true,
        backgroundColor: "#304042",
    })
    mainWindow.loadFile('./src/html/loading.html');
});

ipcMain.on('reload-page', reloadPage)
ipcMain.on('copy-text', copyText)
ipcMain.handle("paste-text", async (event, ...args) => {
    const clipboardText = clipboard.readText();
    return clipboardText;
});

function getCPUInfo() {
    sysInfo.cpu(function(data) {
      const cpuInfo = JSON.stringify(data);
      mainWindow.webContents.send('get-cpu', cpuInfo);
    });
  }
  getCPUInfo();
  ipcMain.on('get-cpu', getCPUInfo);

app.on('before-quit', (event) => {
    mainWindow.webContents.send('close-connection');
    app.quit();
})
app.on('window-all-closed', (event) => {
    // CREATE: Create a call to web renderer through webcontent through the preload.js

    if (process.platform !== 'darwin') {
        //Check this tomorrow
        mainWindow.webContents.send('close-connection');
        app.quit();
    }
});

// End Main Electron Body