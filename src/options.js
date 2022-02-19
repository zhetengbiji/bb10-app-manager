var getEl = document.getElementById.bind(document)
function submit (event) {
  for (var hosts = getEl("hosts").value.replace(/[ \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/g, "").toLowerCase().split(","), a = hosts.length - 1; 0 <= a; --a) {
    hosts[a] ? hosts[a] = hosts[a].split("/")[0] : hosts.splice(a, 1)
  }
  window.localStorage.hosts = hosts.join("|")
  getEl("save").disabled = true
  getEl("save").value = "Saved"
  setTimeout(function () {
    getEl("save").disabled = false
    getEl("save").value = "Save"
  }, 1E3)
  update()
  event.preventDefault()
}
function update () {
  getEl("hosts").value = window.localStorage.hosts ? window.localStorage.hosts.split("|").join(", ") : ""
  for (var html = "", hosts = window.localStorage.hosts.split("|"), index = 0, length = hosts.length; index < length; ++index) {
    if (hosts[index]) {
      html += "<li>" + hosts[index].link("https://" + hosts[index]) + "</li>"
    }
  }
  if (html) {
    html = ("Manage your device" + (1 < length ? "s" : "") + ":").bold() + "<br><ul>" + html + "</ul>"
  }
  getEl("links").innerHTML = html
}
document.addEventListener("DOMContentLoaded", function () {
  update()
  document.forms[0].addEventListener("submit", submit)
  getEl("hosts").addEventListener("keypress", function (event) {
    13 == event.keyCode && submit(event)
  })
})
