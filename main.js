const {app,BrowserWindow,ipcMain,Menu, Notification, IncomingMessage,clipboard } = require('electron');
const url = require('url');
const path = require('path');
let userName;
//let uuid = store.get('uuid');
let win;
const NOTIFICATION_TITLE = 'N.E.T.';


// Check if storage has uuid, if not, run generateUUID function from userIDGeneration.js
function getUUID() {
    //WIP
    // Check 
    if(localStorage.getItem('uuid') === null) {
        uuid = generateUUID();
        localStorage.setItem('uuid', uuid);
    }
    return uuid;
}

//console.log("Generating User ID: ",generateUUID());
// Windows API Section
function minWindow() {
   win.minimize();
}
function maxWindow() {
    win.isMaximized() ? win.unmaximize() : win.maximize();
}
function closeWindow() {
    console.log("Closing window..");
    app.quit();
}

function sendNotif(notifEmitter, notifContent){
    let notif = new Notification({
        title: NOTIFICATION_TITLE,
        subtitle: notifEmitter,
        body: `${notifEmitter} \n${notifContent}`
    });
    notif.show();
}

function getWinFocus(_event, notifEmitter, notifContent){
    if(!win.isFocused()){
        console.log(notifEmitter);
        sendNotif(notifEmitter,notifContent);
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


function setUsername(_event, name){
    userName = name;
    console.log(` User name is now: ${userName}`);
}
function getUsername(){
    console.log(`Sending username: ${userName}`);
    win.webContents.send('get-username',userName);
}

ipcMain.on('send-complete', (_event, value) => {
    console.log(`[RENDERER] User name is now: ${value}`);
});

function getPeerId(){
    return peerId;
}

ipcMain.on('getUsername',getUsername);
ipcMain.on('set-username',setUsername);
// End App Variables
// Main Electron Body

function reloadPage() {
    console.log("Reloading page..");
    win.reload();
}

function copyText(_event, copiedText) {
    try{
        clipboard.writeText(copiedText);
        console.log(`Copied text: ${copiedText}`);
    }
    catch(err) {
        console.log(err);
    }
}

app.on("ready",function(){
    win = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            //contextIsolation:false,
            preload: path.join(__dirname, 'src/preload.js')
        },
        width:765,
        height:550,
        minHeight:600,
        minWidth:500,
        frame:false,
        title:"Loading...",
        resizable:true,
        backgroundColor:"#304042",
        })
        win.loadFile('index.html');
});

ipcMain.on('reload-page', reloadPage)
ipcMain.on('copy-text',copyText)
ipcMain.handle("paste-text", async (event, ...args) => {
    const clipboardText = clipboard.readText();
    return clipboardText;
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

// End Main Electron Body