const {app,BrowserWindow,ipcMain,Menu, Notification, IncomingMessage,clipboard, autoUpdater } = require('electron');

app.setAppUserModelId('N.E.T.');
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
/**
 * Sends Notification to OS. 
 * @param {*} notifEmitter 
 * @param {object} notifContent 
 */
function sendMessageNotif(notifEmitter, notifContent){
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
        sendMessageNotif(notifEmitter,notifContent);
    }
}
ipcMain.on('min-window', minWindow);
ipcMain.on('max-window', maxWindow);
ipcMain.on('close-window', closeWindow);
ipcMain.on('check-if-focused', getWinFocus)