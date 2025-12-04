const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('./database');

let mainWindow;
let database;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  // Initialize database
  database = new Database();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('get-bills', async () => {
  return database.getBills();
});

ipcMain.handle('create-bill', async (event, bill) => {
  return database.createBill(bill);
});

ipcMain.handle('update-bill', async (event, id, bill) => {
  return database.updateBill(id, bill);
});

ipcMain.handle('delete-bill', async (event, id) => {
  return database.deleteBill(id);
});

ipcMain.handle('archive-bill', async (event, id) => {
  return database.archiveBill(id);
});

ipcMain.handle('get-payments', async (event, billId) => {
  return database.getPayments(billId);
});

ipcMain.handle('create-payment', async (event, payment) => {
  return database.createPayment(payment);
});

ipcMain.handle('update-payment', async (event, id, payment) => {
  return database.updatePayment(id, payment);
});

ipcMain.handle('delete-payment', async (event, id) => {
  return database.deletePayment(id);
});

ipcMain.handle('get-tags', async () => {
  return database.getTags();
});

ipcMain.handle('create-tag', async (event, tag) => {
  return database.createTag(tag);
});

ipcMain.handle('get-statistics', async () => {
  return database.getStatistics();
});

ipcMain.handle('export-csv', async () => {
  return database.exportToCSV();
});