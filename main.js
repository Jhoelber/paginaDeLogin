const { app, BrowserWindow, Menu, globalShortcut, remote, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const PDFWindow = require('electron-pdf-window');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      webSecurity: true,
      sandbox: true,
      allowRunningInsecureContent: false,
      devTools: true,
    },
  });

  const indexPath = 'login.html';
  mainWindow.loadFile(path.join(__dirname, indexPath));

  const template = [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('did-finish-load', () => {
    addNavigationButtons(mainWindow);
    checkInternetConnection();
    //mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    const fileName = item.getFilename();
    const fullPath = path.join(app.getPath('downloads'), fileName);

    item.setSavePath(fullPath);

    item.on('done', async (event, state) => {
      if (state === 'completed') {
        try {
          await fs.promises.access(fullPath);
          abrirPDF(fullPath);
          

        } catch (error) {
          console.error('O arquivo PDF não foi encontrado:', error);
        }
      } else {
        console.error(`Download falhou: ${state}`);
      }
    });
  });
}

async function abrirPDF(caminhoDoPDF) {
  const currentURL = mainWindow.webContents.getURL();

  const pdfWindow = new BrowserWindow({ width: 800, height: 600 });
  pdfWindow.loadURL(`file://${caminhoDoPDF}`);

}

/* 


let pdfWindow = null;

async function abrirPDF(caminhoDoPDF) {
    // Verifica se já existe uma janela aberta para o PDF
    if (!pdfWindow || pdfWindow.isDestroyed()) {
        pdfWindow = new BrowserWindow({ width: 800, height: 600 });
        pdfWindow.loadURL(`file://${caminhoDoPDF}`);
    } else {
        // Se uma janela já estiver aberta, traz ela para frente
        pdfWindow.focus();
    }
*/

function addNavigationButtons(mainWindow) {

  const isLoginPage = mainWindow.webContents.getURL().startsWith('file://' + path.join(__dirname, 'login.html'));
  const isHomePage = mainWindow.webContents.getURL().startsWith('file://' + path.join(__dirname, 'index.html'));

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  if (isLoginPage || isHomePage) {
    mainWindow.webContents.insertCSS(`
    
      .navigation-buttons {
        display: none;
        }
     
    `);
  }
  else {
    mainWindow.webContents.insertCSS(`

    body::before {
      content: '';
      display: block;
      height: 60px;
      overflow-x: hidden;
    }
   
    body::-webkit-scrollbar {
      display: none;
    }
      .navigation-buttons {
        
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: transparent;
        padding: 10px;
        z-index: 9999;
        border: none;
      }
      .navigation-buttons button {
        margin-right: 10px;
        margin-left: 10px;
      }
    `);

    mainWindow.webContents.executeJavaScript(`
      if (!document.getElementById('navigation-container')) {
        const navigationContainer = document.createElement('div');

        navigationContainer.id = 'navigation-container';
        navigationContainer.className = 'navigation-buttons';

        const backButton = document.createElement('button');
        backButton.innerText = 'Voltar';
        backButton.style.cssText = 'background-color: #eee; border: 0.5px solid #ccc; border-radius: 7px; color: black; gap: 10px; margin-right: 5px; padding:8px; font-size: 12px;';
        backButton.addEventListener('click', () => {
          if (history.length > 1) {
            window.history.back();
          }
             
        });
       
        navigationContainer.appendChild(backButton);

        const sairButton = document.createElement('button');
        sairButton.innerText = 'sair';
        sairButton.style.cssText = 'background-color: #eee; border: 0.5px solid #ccc; border-radius: 7px; color: black; gap: 10px; margin-right: 2em; padding:8px; font-size: 12px;';
        sairButton.addEventListener('click', () => {
          
         const historico = history.length;
         console.log(historico);
        
          function goBackToStart() {
           
            history.go(-(historico)+1);
        }
        goBackToStart()
        });
        navigationContainer.appendChild(sairButton);

        document.body.appendChild(navigationContainer);

        if (
            window.location.href.includes('https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp') ||
            window.location.href.includes('https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Comprovante.asp') ||
            window.location.href.includes('https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_qsa.asp')
        ) {
            navigationContainer.style.cssText = 'margin-top: 70px; z-index: 9999;';
        }
        

      }
    `);
  }
}

function checkInternetConnection() {
  const offlineMessageScript = `
    const offlineMessage = document.createElement('div');
    offlineMessage.innerHTML = '<div style="display: flex; align-items: center;"><span>Sem Internet</span></div>';
    offlineMessage.style.color = 'white';
    offlineMessage.style.background = 'rgba(0, 0, 0, 0.8)';
    offlineMessage.style.padding = '20px';
    offlineMessage.style.borderRadius = '10px';
    offlineMessage.style.position = 'fixed';
    offlineMessage.style.top = '50%';
    offlineMessage.style.left = '50%';
    offlineMessage.style.transform = 'translate(-50%, -50%)';
    offlineMessage.style.fontSize = '24px';
    offlineMessage.style.fontWeight = 'bold';
    offlineMessage.style.textAlign = 'center';
    offlineMessage.style.zIndex = '9999';
    offlineMessage.id = 'offline-message';
    document.body.appendChild(offlineMessage);
  `;

  const onlineScript = `
    const offlineMessage = document.getElementById('offline-message');
    if (offlineMessage) {
      offlineMessage.remove();
      location.reload();
    }

    // Recria os botões de navegação
    addNavigationButtons();
  `;

  mainWindow.webContents.executeJavaScript(`
    window.addEventListener('online', () => {
      ${onlineScript}
    });

    window.addEventListener('offline', () => {
      ${offlineMessageScript}
    });

    if (!navigator.onLine) {
      ${offlineMessageScript}
    }
  `);
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
