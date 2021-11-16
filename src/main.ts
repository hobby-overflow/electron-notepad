import path from 'path';
import { BrowserWindow, app, session , ipcMain , dialog} from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import * as fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

 ipcMain.handle('open', async (event) => {
     const { canceled, filePaths } = await dialog.showOpenDialog({
         filters: [
             { name: 'Documents', extensions: ['txt'] }
         ]
     })

     if (canceled) return {canceled, data: [] }

     const data = filePaths.map((filePath) => fs.readFileSync(filePath, { encoding: 'utf8' }))
     return { canceled, data }
 })
 

const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/.bin/electron';

// pathにelectronのパスを明記してあげるとリロードできるようになった
require('electron-reload')(__dirname, {
  electron: path.resolve(__dirname, 
												"../node_modules/electron/dist/electron"),
});

// BrowserWindow インスタンスを作成する関数
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    // 開発モードの場合はデベロッパーツールを開く
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(async () => {
  if (isDev) {
    // 開発モードの場合は React Devtools をロード
    const devtools = await searchDevtools('REACT');
    if (devtools) {
      await session.defaultSession.loadExtension(devtools, {
        allowFileAccess: true,
      });
    }
  }

  // BrowserWindow インスタンスを作成
  createWindow();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());
