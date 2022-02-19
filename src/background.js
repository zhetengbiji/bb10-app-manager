var options = {
  urls: ["https://*/cgi-bin/*"],
  types: ["xmlhttprequest"]
};
function includes (url) {
  if (!window.localStorage.hosts) {
    return true
  }
  var hosts = window.localStorage.hosts.split("|")
  url = url.split("/")[2]
  for (var index = 0, length = hosts.length; index < length; ++index) {
    if (hosts[index] == url) {
      return false
    }
  }
  return true
}
chrome.webRequest.onBeforeSendHeaders.addListener(function (a) {
  if (!includes(a.url)) {
    a = a.requestHeaders
    for (var b = 0, c = a.length; b < c; ++b)
      if ("User-Agent" == a[b].name) {
        a[b].value = "QNXWebClient/1.0"
        break
      }
    return {
      requestHeaders: a
    }
  }
}, options, ["requestHeaders", "blocking"])
chrome.webRequest.onHeadersReceived.addListener(function (a) {
  if (!includes(a.url)) {
    a = a.responseHeaders
    for (var b = 0, c = a.length; b < c; ++b) {
      if ("content-type" == a[b].name.toLowerCase()) {
        "text/xml" != a[b].value && (a[b].value = "application/octet-stream")
        break
      }
    }
    return {
      responseHeaders: a
    }
  }
}, options, ["responseHeaders", "blocking"])

document.addEventListener('click', function (event) {
  const target = event.target
  if (target.tagName === 'A') {
    const href = target.getAttribute('href')
    if (href) {
      event.preventDefault()
      const nw = require('nw.gui')
      nw.Window.open(href, {}, (window) => {
        const loaded = new Promise((resolve, reject) => {
          window.on('loaded', resolve)
          window.on('closed', reject)
        })
        const read = fetch('pb-apps.js').then(res => res.text())
        Promise.all([loaded, read]).then(([_, js]) => {
          window.eval(null, js)
        })
      })
    }
  }
})

if ("undefined" == typeof window.localStorage.hosts) {
  window.localStorage.hosts = ""
}
