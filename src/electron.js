const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1960,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.loadURL('http://localhost:3000/')
}

app.whenReady().then(createWindow)

