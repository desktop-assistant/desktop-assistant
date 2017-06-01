/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, dialog, screen, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import MenuBuilder from './menu';

autoUpdater.autoDownload = false;
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

function sendStatusToWindow(status, text, details) {
  mainWindow.webContents.send('message', status, text, details);
}

function createDefaultWindow() {
  const mainScreen = screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    x: mainScreen.workArea.width - 300 - 20,
    y: 40,
    alwaysOnTop: true,
    // transparent: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    fullscreenable: false,
    frame: false,
    backgroundColor: '#ececec'
  });

  console.log('app.getVersion', app.getVersion());

  mainWindow.loadURL(`file://${__dirname}/app.html#v${app.getVersion()}`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  createDefaultWindow();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('close', 'Checking for update...');
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Update',
    message: 'Found update, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      sendStatusToWindow('progress', 'Downloading update...');
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('close', 'Update not available.');
});

// autoUpdater.on('error', (ev, err) => {
//   sendStatusToWindow('error', 'Error in auto-update', JSON.stringify(err));
// });

autoUpdater.on('download-progress', progressObj => {
  let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
  logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  sendStatusToWindow('progress', logMessage);
});

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('info', 'Update downloaded; will install in 5 seconds');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

ipcMain.on('ready', () => {
  autoUpdater.checkForUpdates();
});
