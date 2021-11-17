import path from 'path';
import { BrowserWindow, app, session , ipcMain , dialog} from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import * as fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

 

const execPath =
  process.platform === 'win32'
    ? '../node_modules/electron/dist/electron.exe'
    : '../node_modules/electron/dist/electron'

// pathにelectronのパスを明記してあげるとリロードできるようになった
require('electron-reload')(__dirname, {
  electron: path.resolve(__dirname, execPath)
});

// BrowserWindow インスタンスを作成する関数
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js')
    },
  });

  ipcMain.handle('open-dialog', async () => {
    const dirpath = await dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })
      .then((result) => {
        if (result.canceled) return;

        return result.filePaths[0];
      })
      .catch((err) => console.log(err));
      
      if (!dirpath) return;

      const filelist = await fs.promises
        .readdir(dirpath, { withFileTypes: true })
        .then((dirents) => 
          dirents
            .filter((dirent) => dirent.isFile())
            .map(({ name }) => path.join(dirpath, name))
        )
        .catch((err) => console.log(err));
        
        return filelist;
  })

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
