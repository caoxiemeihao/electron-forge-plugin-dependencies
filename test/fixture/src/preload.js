// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer } = require('electron');

window.onload = () => {
  const loaded = document.querySelector('h1').innerText.trim() === '💖 Hello World!';
  ipcRenderer.invoke(
    'test-hooks',
    '[test-hooks]', loaded ? 'start success' : 'start failed',
  );
};
