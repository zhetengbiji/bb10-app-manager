const { app, BrowserWindow, session } = require('electron')
const fs = require('fs')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile(path.join(__dirname, 'options.html'))

  const filter = {
    urls: ['https://*/cgi-bin/*'],
    types: ['xmlhttprequest']
  }
  const defaultSession = session.defaultSession

  defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['User-Agent'] = 'QNXWebClient/1.0'
    callback({ requestHeaders: details.requestHeaders })
  })
  defaultSession.webRequest.onHeadersReceived(filter, ({ responseHeaders }, callback) => {
    const contentType = responseHeaders['content-type']
    if (contentType !== 'text/xml') {
      responseHeaders['content-type'] = 'application/octet-stream'
    }
    callback({ responseHeaders: responseHeaders })
  })

  const webContents = win.webContents
  webContents.on('did-create-window', (window) => {
    window.webContents.on('did-finish-load', () => {
      window.webContents.executeJavaScript(fs.readFileSync(path.join(__dirname, 'pb-apps.js'), { encoding: 'utf8' }))
    })
  })
}

app.commandLine.appendSwitch('ignore-certificate-errors')

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
