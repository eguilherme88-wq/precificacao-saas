const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Nome e pasta de dados exclusivos -> não mistura dados/config com outros apps Electron instalados
app.setName('Partner Precificacao SaaS');
app.setPath('userData', path.join(app.getPath('appData'), 'partner-precificacao-saas'));
if (process.platform === 'win32') app.setAppUserModelId('br.com.partner.precificacaosaas');

// Instância única: abrir o atalho de novo só traz a janela já aberta para frente
if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

let janela;
const ehExterno = url => /^(https?:|mailto:|tel:|whatsapp:)/i.test(url);

function criarJanela() {
  janela = new BrowserWindow({
    width: 1366, height: 860, minWidth: 360, minHeight: 560,
    title: 'Partner Precificação SaaS',
    icon: path.join(__dirname, 'app', 'icons', 'icon-512.png'),
    backgroundColor: '#102a56',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: true
    }
  });
  janela.loadFile(path.join(__dirname, 'app', 'index.html'));
  janela.once('ready-to-show', () => { janela.maximize(); janela.show(); });

  // Links externos (WhatsApp, e-mail, sites) abrem no navegador padrão.
  // Janelas em branco (prévia/impressão da proposta) abrem dentro do app.
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if (ehExterno(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return {
      action: 'allow',
      overrideBrowserWindowOptions: { autoHideMenuBar: true, backgroundColor: '#ffffff',
        webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } }
    };
  });
}

// Vale para TODAS as janelas (inclusive a prévia do e-mail aberta pelo app):
// mailto:, WhatsApp e sites vão para o programa padrão do Windows.
app.on('web-contents-created', (_e, wc) => {
  wc.on('will-navigate', (e, url) => { if (ehExterno(url)) { e.preventDefault(); shell.openExternal(url); } });
  if (wc !== janela?.webContents) wc.setWindowOpenHandler(({ url }) => {
    if (ehExterno(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow' };
  });
});

app.on('second-instance', () => {
  if (janela) { if (janela.isMinimized()) janela.restore(); janela.focus(); }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Arquivo', submenu: [{ role: 'reload', label: 'Recarregar' }, { role: 'togglefullscreen', label: 'Tela cheia' }, { type: 'separator' }, { role: 'quit', label: 'Sair' }] },
    { label: 'Editar', submenu: [{ role: 'undo', label: 'Desfazer' }, { role: 'redo', label: 'Refazer' }, { type: 'separator' }, { role: 'cut', label: 'Recortar' }, { role: 'copy', label: 'Copiar' }, { role: 'paste', label: 'Colar' }, { role: 'selectAll', label: 'Selecionar tudo' }] },
    { label: 'Exibir', submenu: [{ role: 'zoomIn', label: 'Aumentar zoom' }, { role: 'zoomOut', label: 'Diminuir zoom' }, { role: 'resetZoom', label: 'Zoom normal' }] }
  ]));
  criarJanela();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) criarJanela(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
