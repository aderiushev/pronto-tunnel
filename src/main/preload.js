const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    startTunnel() {
      ipcRenderer.send('ipc-tunnel', { action: 'start' });
    },
    stopTunnel() {
      ipcRenderer.send('ipc-tunnel', { action: 'stop' });
    },
    saveToClipboard(text) {
      ipcRenderer.send('ipc-tunnel', { action: 'saveToClipboard', payload: { text } });
    },
    on(channel, func) {
      const validChannels = ['ipc-tunnel'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-tunnel'];
      if (validChannels.includes(channel)) {
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
