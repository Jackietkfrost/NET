const { contextBridge, ipcRenderer, clipboard } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  reloadPage: () => ipcRenderer.send('reload-page'),
  copyText: (copiedText) => ipcRenderer.send('copy-text', copiedText),
  pasteText: () => ipcRenderer.invoke('paste-text'),
  getUUID: () => ipcRenderer.invoke('get-uuid'),
  checkIfFocused: (messageEmitter,message) => ipcRenderer.send('check-if-focused',messageEmitter, message),

})

contextBridge.exposeInMainWorld('netVar', {
  getUsername: () => ipcRenderer.send('getUsername'),
  getPeerId: () => ipcRenderer.invoke('getPeerId'),
  setUsername: (name) => ipcRenderer.send('set-username', name),
  getReqUser: (callback) => ipcRenderer.on('get-username', callback),
})
contextBridge.exposeInMainWorld('titlebar', {
  closeWindow: () => ipcRenderer.send('close-window'),
  maxWindow: () => ipcRenderer.send('max-window'),
  minWindow: () => ipcRenderer.send('min-window')
})

contextBridge.exposeInMainWorld('peerAPI', {
  addListener: () => ipcRenderer.send('add-listener')
})