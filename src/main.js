import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import Events from './conectBD/events.js';
import { createEvents } from "./conectBD/Events/ValidarConflictos.js";
import { isPackaged } from 'electron-is-packaged'; 

// === INICIO DEL PARCHE DE MÓDULO NATIVO FINAL ===
if (isPackaged) {
    // Ruta corregida: app.asar.unpacked se reemplaza por 'app'
    const unpackedPath = path.join(
        process.resourcesPath, 
        'app', // <- ESTE ES EL CAMBIO CLAVE
        'node_modules',
        'sqlite3',
        'build', 
        'Release'
    );
    
    // Agrega la ruta al inicio de las rutas de búsqueda de Node.js.
    module.paths.unshift(unpackedPath);
}

app.whenReady().then(() => {
  createEvents(); // <-- registra todos los handlers
});


Events.createEvents();


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: true
    },
  });
  mainWindow.maximize(true)
  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // 🚨 LA CORRECCIÓN 100% VERIFICADA POR ASAR
    // Combina la raíz del app.asar (app.getAppPath()) con la ruta real dentro del asar.
    
    const finalPath = path.join(
        app.getAppPath(),
        '.vite',
        'renderer', // 👈 ¡'renderer' ES la carpeta correcta!
        MAIN_WINDOW_VITE_NAME, // que es 'main_window'
        'index.html'
    );
    
    mainWindow.loadFile(finalPath);
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process

// 👇 Escucha la señal de cerrarApp desde renderer
ipcMain.on("close-app", () => {
  console.log('Cerrando la aplicación...');
  app.quit();
});
