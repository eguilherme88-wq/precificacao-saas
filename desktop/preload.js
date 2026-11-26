// Sem APIs do Node expostas à página (segurança). Apenas identifica o ambiente desktop.
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('desktopApp', { plataforma: process.platform });
