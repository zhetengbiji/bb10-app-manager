var k, n, r, t, aa, ba, u = [null], v = [], ca, x, y, D, I, J = document.getElementById.bind(document);
function da (b) {
    b.previousSibling.disabled = !b.checked
}
function L (b) {
    document.documentElement.innerHTML = b
}
function ea () {
    L("<h2>" + (fa(!0) ? "Logged out" : "Unable to log out") + '</h2><button onclick="ga()">Log in again</button>')
}
function ha (b) {
    var d = J("ial").checked ? "Install and Launch" : "Install";
    if (b.files.length) {
        for (var e = 0, a = b.files.length; e < a; e++)
            u.push([4096 < b.files[e].size ? d : "Install Debug Token", b.files[e]]);
        b.value = null;
        u.k()
    }
    return !1
}
function ga () {
    document.title = "BB10 / PlayBook App Manager";
    try {
        document.open(),
            document.write("<!DOCTYPE html><html></html>"),
            document.close()
    } catch (b) { }
    L("<h1>Loading...</h1>");
    var d = !1;
    try {
        d = 0 > document.cookie.indexOf("dtmauth")
    } catch (e) { }
    setTimeout(d ? jaAsync : M, 0)
}
async function jaAsync () {
    try {
        document.cookie = "loginsession=deleted;expires=Jan 1, 1970 00:00:00 UTC"
    } catch (b) { }
    var d = new XMLHttpRequest;
    switch (await loginAsync(d, "")) {
        case "PasswdChallenge":
            var e = d.responseXML.getElementsByTagName("FailedAttempts")[0].textContent | 0
                , a = d.responseXML.getElementsByTagName("RetriesRemaining")[0].textContent | 0;
            k = d.responseXML.getElementsByTagName("Challenge")[0].textContent;
            n = d.responseXML.getElementsByTagName("Algorithm")[0].textContent;
            r = d.responseXML.getElementsByTagName("Salt")[0].textContent;
            t = d.responseXML.getElementsByTagName("ICount")[0].textContent | 0;
            if (2 != n) {
                L("Unsupported Algorithm: " + n);
                break
            }
            L("<head><style>body,input{font:16px/1.5 verdana}</style></head><body><h2>Log in to your BB10 / PlayBook device" + (e ? " (" + (e + 1) + " of " + (e + a) + ")" : "") + "</h2>Hostname: " + location.hostname + '<br/><form onsubmit="return la()">Password: <input type=password id=passwd size=15 required autocomplete=off><br><label><input type=checkbox id=save>Auto Login</label><br><br><input type=submit id=submit value="Log in"> </form></body>');
            !e && localStorage.passwd && (J("save").checked = !0,
                la());
            break;
        case "Success":
            setTimeout(M, 0);
            break;
        case "Error":
            L(d.responseXML.getElementsByTagName("ErrorDescription")[0].textContent)
    }
}
function la () {
    J("submit").disabled = !0;
    J("submit").value = "Logging in";
    document.forms[0].appendChild(document.createElement("progress")).id = "prog";
    for (var b = r, d = Array(b.length + 7 >> 3), e = 0, a = d.length; e < a; e++)
        d[e] = 0;
    e = 0;
    for (a = b.length; e < a; e++)
        d[e >> 3] |= parseInt(b.charAt(e), 16) << (7 - e % 8 << 2);
    aa = J("passwd").value ? J("passwd").value : localStorage.passwd;
    (ba = localStorage.hash) && localStorage.passwd == aa && localStorage.salt == r && localStorage.icount == t ? ma(d[0], d[1], t, k + localStorage.hash, void 0, 2) : ma(d[0], d[1], t, aa, void 0, 0);
    return !1
}
function na (b, d, e, a, f, c) {
    var g = (f >>> 8) + 1 << 8;
    g > a && (g = a);
    for (var h = f; h < g; h++)
        b[0] = (h & 255) << 24 | (h & 65280) << 8 | h >>> 8 & 65280 | h >>> 24,
            b[1] = d,
            b[2] = e,
            b = oa(b, 76);
    J("prog").value = h / a / 2 + c / 4;
    h == a ? setTimeout(function () {
        ma(d, e, a, void 0, b, ++c)
    }, 0) : setTimeout(function () {
        na(b, d, e, a, h, c)
    }, 0)
}
function ma (b, d, e, a, f, c) {
    switch (c & 1) {
        case 1:
            f.shift();
            f.shift();
            f.shift();
            a = pa(f);
            if (c & 2) {
                setTimeout(async function () {
                    switch (await loginAsync(new XMLHttpRequest, "challenge_data=" + qa(a) + "&")) {
                        case "Success":
                            J("save").checked && (localStorage.passwd = aa,
                                localStorage.salt = r,
                                localStorage.icount = t,
                                localStorage.hash = ba);
                            k = n = r = t = void 0;
                            setTimeout(M, 0);
                            break;
                        case "Denied":
                            fa(),
                                setTimeout(jaAsync, 0)
                    }
                }, 0);
                break
            }
            ba = a;
            a = k + a;
            ++c;
        case 0:
            f = ra(a),
                f.unshift(0, b, d),
                f = oa(f, a.length + 12),
                setTimeout(function () {
                    na(f, b, d, e, 1, c)
                }, 0)
    }
}
function fa (b) {
    localStorage.clear();
    try {
        document.cookie = "loginsession=deleted;expires=Jan 1, 1970 00:00:00 UTC",
            b && (document.cookie = "dtmauth=deleted;expires=Jan 1, 1970 00:00:00 UTC")
    } catch (d) {
        return !1
    }
    return !0
}
function M (b) {
    if (b = !0 !== b)
        x ? (x.innerHTML = "Refresh list of installed apps ...",
            y.innerHTML = "<progress id=prog></progress>") : L("<h1>Retrieve list of installed apps from BB10 / PlayBook device ...</h1>");
    var d = new XMLHttpRequest
        , e = new FormData;
    e.append("command", "List");
    appInstallerAsync(d, e, ta.bind(d, b))
}
function ta (b) {
    if (!(4 > this.readyState || 200 !== this.status)) {
        var d, e = !1, a, f = this.responseText.split("\n"), c = f.shift(), g = [];
        if ("Info" == c.slice(0, 4) && "@applications" == f.shift().slice(0, 13)) {
            for (var h = 0, l = f.length; h < l; ++h)
                if (c = f[h].split(","),
                    !(2 > c.length || (a = c[0].split("::"),
                        2 > a.length))) {
                    var m = {
                        l: a[0],
                        dir: a[1],
                        name: ua(a[0].slice(0, -28)),
                        d: c[1],
                        src: "websl",
                        g: !1
                    };
                    d = {};
                    var w = 2
                        , O = c.length;
                    a: for (; w < O; ++w)
                        if (a = c[w].split("::"),
                            1 == a.length)
                            switch (w) {
                                case 3:
                                    a[0] && (m.g = !0);
                                    break;
                                case 4:
                                    m.size = a[0];
                                    e = !0;
                                    break;
                                default:
                                    "websl" == a[0] && (m.src = "websl")
                            }
                        else
                            switch (a[0]) {
                                case "dat":
                                    try {
                                        var E = JSON.parse(c.slice(w).join(",").slice(5)), q;
                                        for (q in E)
                                            d[q] = E[q]
                                    } catch (z) { }
                                    break a;
                                default:
                                    d[a[0]] = a[1]
                            }
                    for (q in d)
                        switch (q) {
                            case "name":
                                m.name = d[q];
                                break;
                            case "version":
                                m.c = d[q];
                                if (!m.c.length)
                                    break;
                                0 == m.d.indexOf(m.c) ? (m.d = m.c.bold() + m.d.slice(m.c.length),
                                    m.c = "") : m.c = m.c.bold();
                                break;
                            case "source":
                                m.src = d[q];
                                break;
                            case "contentID":
                                m.i = d[q];
                                break;
                            case "iconID":
                                m.f = d[q];
                                break;
                            case "vendor":
                                m.vendor = d[q]
                        }
                    g.push(m)
                }
            g.sort(function (a, b) {
                if (a.src == b.src) {
                    var c = a.name.toLowerCase()
                        , d = b.name.toLowerCase();
                    return c > d ? 1 : c < d ? -1 : 0
                }
                return a.src > b.src ? 1 : -1
            });
            J("apptbl") ? (d = J("apptbl"),
                d.innerHTML = '<tr class=head><th class=head><button class="updtbl" onclick="M()">Refresh List</button>Name</th><th colspan=2 title="Internal | AppWorld">Version</th>' + (e ? "<th>Size</th>" : "") + "<th id=srcth>Source</th><th class=cmdcol>Command</th></tr>") : (L('<head><title>BB10 / PlayBook App Manager</title><style>body,input,select,textarea,button{font:16px verdana,tahoma,arial,sans-serif}div.content{margin-top:129px}table.apptbl{border-collapse:collapse;border:solid #999 2px}th,select{background:#ccc}td.size{text-align:right}select{font-weight:bold;min-width:76px}option.src{background:#fff}.ok{color:#4a4}.err{color:#f66}.other{color:#f90}.file{color:#66f}span.footnote{color:#888;font-size:13px;line-height:90px}tr:hover{background:#ffa}.pointer:hover{background:#feb;border-radius:3px;-webkit-transition:background .5s;-moz-transition:background .5s}tr.blink{background:#ccf}tr.head{height:30px}th.head{height:24px}button.updtbl{position:absolute;left:12px;height:24px;margin-top:-3px}div#panel{position:fixed;background:#f1f1f1;padding:2px 2px 0 2px;border-bottom:1px solid #eee;border-color:#ccc;top:0px;left:0px;width:100%;height:118px;overflow-x:hidden;z-index:9}div.box-shadow{border-color:#aaa !important;box-shadow:0 1px 10px rgba(102,102,102,.4)}div.info{float:left;width:66%;padding-right:.5%}div.queue{position:absolute;left:66.5%;width:33%;padding-left:.5%;border-left:1px solid #ddd}div.title{height:24px;line-height:24px;margin-left:2px;width:100%;overflow:hidden}div#headline{font-weight:bold;text-shadow: 0 0 1px #aaa}div.cross{width:16px;height:16px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKBAMAAAB/HNKOAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABHRSTlMA7zBgg9mmrAAAADNJREFUeF4li4EJADAMwkI/WNcD2n2wEwr7/6YVBBGJyk1sE0716EywWJ1Qz5GLqNVSrw+bZAUvknrSxQAAAABJRU5ErkJggg==) no-repeat 3px 3px}div#gohome{float:right;margin-top:3px;border:1px solid transparent;border-radius:2px;cursor:pointer}div#gohome:hover{border-color:#C6C6C6!important;background-image:-webkit-linear-gradient(top,#f8f8f8,#f1f1f1);background-image:-moz-linear-gradient(top,#f8f8f8,#f1f1f1)}button.tight{height:24px;margin-top:0;margin-bottom:0}ol.logs{margin:0}.pointer{cursor:pointer}pre.news{width:100%;margin:2px;font-family:Consolas,Lucida Console,dejavu sans mono,monospace;overflow-x:hidden}pre#news{height:90px}pre#qlist{height:90px;word-wrap:break-word}span#about{white-space:normal}input#files{height:0px;visibility:hidden;position:absolute}a{text-decoration:none;color:#26b}a:visited{color:#26b}a:hover,a:active{color:#F50}@media screen{select{-webkit-appearance:none;-webkit-user-select:none;background-image:-webkit-linear-gradient(#ededed, #ededed 38%, #dedede);border:1px solid rgba(0, 0, 0, 0.25);border-radius:2px;box-shadow:0 1px 0 rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.75);color:#444;font:inherit;margin:0 1px 0 0;text-shadow:0 1px 0 rgb(240, 240, 240);padding:0 2px 0 2px}select:disabled{color:graytext;background:-webkit-linear-gradient(#fefefe, #f8f8f8 40%, #e9e9e9);}select:enabled:hover{background-image:-webkit-linear-gradient(#f0f0f0, #f0f0f0 38%, #e0e0e0);border-color:rgba(0, 0, 0, 0.3);box-shadow:0 1px 0 rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.95);color:black;}select:enabled:active{background-image:-webkit-linear-gradient(#e7e7e7, #e7e7e7 38%, #d7d7d7);box-shadow:none;text-shadow:none;}}img{padding:0 4px 0 2px}@media print{#panel,.updtbl,.cmdcol{display:none}div.content{margin:0}select{-webkit-appearance:none;border:0}}</style><link rel="Shortcut Icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABmFBMVEUAAADS0tL///+YmJiLi4uKiorc3NyMjIzT09O5ubnu7u7////Z2dnNzc22trbCwsKxsbGNjY3T09Orq6vj4+Pw8PDa2trY2NjX19ednZ2ampr////S0tKcnJyVlZXp6emUlJSvr6+kpKTHx8eVlZWRkZGjo6OUlJSRkZGRkZGbm5taWlpZWVmYmJiIiIhYWFiZmZlUVFSHh4eXl5eUlJSEhISMjIyLi4uEhISUlJSUlJQDAwMQEBAICAgLCwsjIyNTU1NXV1chISEYGBgEBAQGBgYVFRVKSkoMDAwHBwcJCQlSUlJVVVVkZGRvb28fHx9ERESCgoJiYmIsLCwiIiI1NTVgYGDj4+M8PDzHx8fZ2dkCAgIXFxdjY2MODg4aGhrd3d0wMDATExPg4OBQUFDMzMxpaWmenp5mZmaWlpZeXl5AQEAZGRnU1NS0tLSysrJubm7S0tK3t7d2dnY7OzuBgYGfn5+4uLh8fHzBwcHQ0NDe3t4RERHNzc2vr6+ampqUlJQSEhJfX1+qqqpOTk6GhoaFhYU9PT22i8xkAAAAO3RSTlMA9Ab55Ovq8dzsXwfvzNfm5Pq/63RKvPC66uoFrOzjS/jv7K3m2O3gs8BX9/hlw/rr+sUDYMTu7sdjA+g2eC4AAADuSURBVHheTcDTVkQBAAXQM0S2bdvXxtj2ZNvWb1cPtdqAsazJbq0wGJqt9pbGcqC9w1RysmwkwrLOkqnOiO6egOdPurYB/az7n7dKVPk4LhF9DESLfo7jdqtRE1NcucT7aW7foyhKzIH68Oev65vzcC/6gvmn+Gb+Nf5xdru+ERxCK89cXF4xB4dp5hvfiTZZEIS9H0fHJ4I8gy5dojN37vuHZ5f/RdMHMEgmCVHb2t6hJJFIZoYxEiJESadVldY1kQiNYmxcolSyIMsFUqW0iUlgappPZb0M482m+Nm5eQALi2bLks22bDGvrK7hC1qcRWT2+eRhAAAAAElFTkSuQmCC"/></head><body ondragover="event.preventDefault()" ondrop="return ha(event.dataTransfer)"><div id="panel"><div class=info><div class=title><div id=gohome onclick="va()"><div class="cross"></div></div><div id=headline></div></div><pre id=news class=news></pre></div><div class=queue><div class=title><form onsubmit="return false"><button id=fbtn class=tight onclick="this.form.files.click()">Install Apps</button><input id="files" type="file" multiple onchange="ha(this)" accept=".bar"> <span id=lbtn></span> <label><input id=ial type=checkbox>Launch after install</label></form></div><pre id=qlist class=news></pre></div></div><div class=content><table cellpadding=3 cellspacing=2 border=1 class=apptbl><tbody id=apptbl><tr class=head><th class=head><button class="updtbl" onclick="M()">Refresh List</button>Name</th><th colspan=2 title="Internal | AppWorld">Version</th>' + (e ? "<th>Size</th>" : "") + "<th id=srcth>Source</th><th class=cmdcol>Command</th></tr></tbody></table></div></body>"),
                    ca = J("panel"),
                    x = J("headline"),
                    y = J("news"),
                    d = J("apptbl"),
                    u.j(),
                    window.onscroll = function () {
                        ca.className = window.scrollY ? "box-shadow" : ""
                    }
                    ,
                    window.onbeforeunload = function () {
                        return u[0] ? "Installation is still in progress." : null
                    }
            );
            I = [[], []];
            for (var h = 0, l = g.length, P; h < l; ++h)
                a = d.appendChild(document.createElement("tr")),
                    m = g[h],
                    f = !m.src || 0 > ["appworld", "developer", "apk", "betazone"].indexOf(m.src.toLowerCase()) || m.g,
                    c = "sys.data." == m.name.slice(0, 9) ? " disabled" : "",
                    m.i && (m.name = '<a href="http://appworld.blackberry.com/webstore/content/' + m.i + '/" target="_blank">' + m.name + "</a>"),
                    m.f && (m.name = '<img src="http://appworld.blackberry.com/webstore/servedimages/' + m.f.slice(m.f.lastIndexOf("/") + 1) + '.png/?t=18">' + m.name),
                    "apk" == m.src && (m.name = '<a href="https://play.google.com/store/apps/details?id=' + m.name + '" target="_blank">' + m.name + "</a>"),
                    a.innerHTML = '<td title="' + (m.vendor ? m.vendor : "") + '">' + m.name + "</td>" + (m.c ? "<td>" + m.d + "</td><td>" + m.c + "</td>" : "<td colspan=2>" + m.d + "</td>") + (e ? "<td class=size nowrap>" + wa(m.size) + "</td>" : "") + "<td nowrap>" + m.src + "</td><td class=cmdcol id=" + m.l + ' nowrap><button onclick="N(this)" value="Is Running"' + c + '>?</button> <button onclick="N(this)"' + c + '>Launch</button> <button onclick="N(this)"' + c + '>Terminate</button> <button onclick="N(this)" id="' + m.dir + (f ? '" disabled>' + (m.g ? "Permanent" : "Uninstall") + '</button><input type=checkbox onclick="da(this)">' : '">Uninstall</button>') + "</td>",
                    m.src != P && (I[0].push(P = m.src),
                        I[1].push(a.rowIndex));
            I[1].push(d.rows.length);
            xa();
            b && va()
        } else
            "Error: User" == c.slice(0, 11) ? setTimeout(jaAsync, 0) : L(c + '<br><br><button onclick="ga()">Try again</button>')
    }
}
/**
 * loginAsync
 * @param {XMLHttpRequest} xhr 
 * @param {string} query 
 * @returns 
 */
function loginAsync (xhr, query) {
    xhr.open("GET", "/cgi-bin/login.cgi?" + query + "request_version=1", true);
    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (200 === xhr.status) {
                if (xhr.response.length) {
                    try {
                        resolve(xhr.responseXML.getElementsByTagName("Status")[0].textContent)
                    } catch (e) {
                        L("Invalid HTTP Response: <br><br>" + xhr.response)
                    }
                } else {
                    L("Empty response. Check whether the correct User-Agent was sent.")
                }
            } else {
                L("HTTP Error " + xhr.status + "<br><br>" + xhr.responseText)
            }
            resolve()
        }
        xhr.onerror = reject
        xhr.send(null)
    })
}
function appInstallerAsync (b, d, e) {
    b.onreadystatechange = e;
    b.open("POST", "/cgi-bin/appInstaller.cgi", !0);
    b.send(d)
}
function ya (b, d, e, a) {
    var f = 0;
    switch (b.slice(0, 7)) {
        case "Install":
            f = 2;
            break;
        case "Uninsta":
            f = 1
    }
    x.innerHTML = b + " <span class=file>" + d + "</span> ..." + (e ? " (" + (e + 1) + "/10)" : "");
    if (this.responseText) {
        y.innerHTML = this.responseText;
        var c = this.responseText.split("\n")
    } else
        y.innerHTML = "<progress id=prog></progress><br/><span id=prog-txt></span>";
    if (4 === this.readyState) {
        var g, h;
        if ("Error:" == c[0].slice(0, 6))
            g = c[0],
                "User" == c[0].slice(7, 11) && (setTimeout(jaAsync, 0),
                    h = !1);
        else {
            for (var l = 0, m = c.length; l < m; l++)
                if ("result::" == c[l].slice(0, 8)) {
                    g = c[l].slice(8);
                    break
                } else
                    "actual_id::" == c[l].slice(0, 11) && (h = c[l].slice(11));
            this.h && (h = this.h);
            f && (g ? "success" == g && setTimeout(M.bind(void 0, !0), 0) : 10 > ++e ? (y.innerHTML += "<span class=other>" + b + "ation seems to be incomplete. Retry in 2 seconds.</span>",
                setTimeout(function () {
                    a(e)
                }, 2E3)) : (y.innerHTML += "<span class=err>" + b + "ation seems to be incomplete. Maximum retries reached.</span>",
                    g = "no result (may be incomplete)"))
        }
        if (g) {
            switch (g.slice(0, 4).toLowerCase()) {
                case "true":
                case "succ":
                case "term":
                    c = "ok";
                    break;
                case "erro":
                case "fals":
                case "fail":
                case "inva":
                case "no r":
                    c = "err";
                    break;
                default:
                    g | 0 ? (g = "success",
                        c = "ok") : c = "other"
            }
            x.innerHTML = b + " <span class=file>" + d + "</span>: <span class=" + c + ">" + g + "</span>";
            h && (x.innerHTML = "<span class=pointer onclick='Aa(" + (2 == f ? v.length : '"' + h + '"') + ")'>" + x.innerHTML + "</span>");
            2 == f && (!1 === h ? u.unshift(null) : (v.push([c, x.innerHTML, h]),
                u.j()))
        }
    }
    y.scrollTop = y.scrollHeight;
    J("gohome").style.display = "inline-block"
}
function N (b, d) {
    var e = b.value ? b.value : b.innerHTML;
    "Permanent" == e && (e = "Uninstall");
    var a = b.parentNode.parentNode.firstChild.innerHTML;
    d || (d = 0);
    var f = b.parentNode.id
        , c = f.slice(0, -28)
        , f = "Uninstall" == e ? b.id : f.slice(-27)
        , g = new XMLHttpRequest
        , h = new FormData;
    h.append("command", e);
    h.append("package_id", f);
    h.append("package_name", c);
    g.h = f.split(".").join("-");
    appInstallerAsync(g, h, ya.bind(g, e, a, d, function (a) {
        N(b, a)
    }))
}
function Ba (b, d) {
    var e = new FormData;
    e.append("command", b);
    e.append("file", this);
    var a = new XMLHttpRequest;
    u[0][2] = a;
    a.upload.onprogress = Ca;
    a.onabort = ya.bind({
        readyState: 4,
        responseText: "result::abort"
    }, b, this.name, 0);
    appInstallerAsync(a, e, ya.bind(a, b, this.name, d, Ba.bind(this, b)))
}
function Da (b) {
    b = b.innerHTML;
    var d = new XMLHttpRequest
        , e = new FormData;
    e.append("command", b);
    appInstallerAsync(d, e, ya.bind(d, b, "", 0))
}
function Ea (b) {
    var d = ""
        , e = v.length
        , a = {
            "": e,
            ok: 0,
            err: 0,
            other: 0
        }
        , f = {
            "": "All",
            ok: "Success",
            err: "Failure",
            other: "Other"
        };
    if (e) {
        for (var c = 0; c < e; ++c)
            b && b != v[c][0] || (d += "<li>" + v[c][1] + "</li>"),
                a[v[c][0]]++;
        y.innerHTML = "<ol class=logs>" + d + "</ol>";
        if (!b) {
            d = "Install logs:";
            for (c in a)
                a[c] && (d += " <button class='tight " + c + "' onclick='Ea(" + (c ? '"' + c + '"' : "") + ")'>" + f[c] + " (" + a[c] + ")</button>");
            d += ' | <button class=tight onclick="Fa()">Clear Logs</button>';
            x.innerHTML = d;
            J("gohome").style.display = "inline-block"
        }
    }
}
function Fa () {
    v = [];
    J("lbtn").innerHTML = "";
    va()
}
function Ga (b) {
    this.className = b & 1 ? "blink" : "";
    b && setTimeout(Ga.bind(this, --b), 80)
}
function Ha () {
    var b = J("apptbl").rows;
    D = this.options[this.selectedIndex].value;
    for (var d = 1, e = b.length; d < e; ++d)
        b[d].style.display = D && (d < I[1][D] || d >= I[1][(D | 0) + 1]) ? "none" : ""
}
function Aa (b) {
    if (b = J("string" == typeof b ? b : v[b][2]))
        b = b.parentNode.parentNode,
            b.style.display && (J("src").selectedIndex = 0,
                Ha.bind(J("src"))()),
            document.body.scrollTop = b.offsetTop,
            Ga.bind(b, 7)()
}
function xa () {
    var b = J("srcth")
        , d = J("apptbl");
    b.innerHTML = "";
    var e = b.appendChild(document.createElement("select"))
        , a = e.appendChild(document.createElement("option"));
    e.style.width = window.getComputedStyle(b, null).width;
    e.onchange = Ha;
    e.id = "src";
    a.value = "";
    a.innerHTML = "Source - All (" + (d.rows.length - 1) + ")";
    D || (a.selected = !0);
    b = 0;
    for (d = I[0].length; b < d; ++b)
        a = e.appendChild(document.createElement("option")),
            a.className = "src",
            a.value = b,
            a.innerHTML = I[0][b] + " (" + (I[1][b + 1] - I[1][b]) + ")",
            D === b.toString() && (a.selected = !0);
    Ha.bind(e)()
}
function Ca (b) {
    if (b.lengthComputable && (J("prog") && (J("prog").value = b.loaded / b.total),
        J("prog-txt")))
        if (this.e) {
            var d = Date.now(), e = d - this.e[0], a;
            if (1E3 < e) {
                e = (b.loaded - this.e[1]) / e * 1E3;
                a = (b.total - b.loaded) / e;
                var f = J("prog-txt"), c;
                c = a / 3600 | 0;
                var g = (a / 60 | 0) % 60;
                a = a % 60 | 0;
                c || g ? (c = (c ? c + ":" : "") + ((c ? (9 < g ? "" : "0") + g : g) + ":"),
                    c += (9 < a ? "" : "0") + a) : c = a + " sec";
                f.innerHTML = "<span class=other>" + wa(e) + "/s</span> (<span class=file>" + c + "</span> remaining)";
                this.e = [d, b.loaded]
            }
        } else
            this.e = [Date.now(), b.loaded]
}
function va () {
    if ("169.254." == location.hostname.slice(0, 8)) {
        var b = new XMLHttpRequest;
        b.onloadend = Ia;
        b.open("GET", "/cgi-bin/dynamicProperties.cgi", !0);
        b.send();
        Ia('<span style="color:#bbb">Loading device status ...</span>')
    } else
        Ia('<span style="color:#bbb">Device status is not available via wireless connection.</span>')
}
function Ia (b) {
    "string" !== typeof b && (b = "");
    if (200 == this.status && this.responseXML)
        try {
            var d = this.responseXML.getElementsByTagName("BatteryLevel")[0].textContent | 0
                , e = this.responseXML.getElementsByTagName("FreeApplicationSpace")[0].textContent
                , a = wa(e);
            b = "Free Space: " + ("<span class=" + ("GB" == a.slice(-2) ? "file" : "other") + ' title="' + e.slice(0, e.length % 3) + e.slice(e.length % 3).replace(/(\d{3})/g, ",$1") + ' bytes">' + a + "</span>") + ' <span style="color:#bbb">|</span> Battery Level: <span class=' + (60 > d ? 20 > d ? "err" : "other" : "ok") + ">" + d + "</span>"
        } catch (f) {
            b = '<span style="color:#bbb">Device is disconnected.</span>'
        }
    x.innerHTML = "BB10 / PlayBook App Manager 2.2";
    y.innerHTML = b + '\n\n<button onclick="ea()">Log out</button> <button onclick="Da(this)">List Device Info</button> <button onclick="Ja()">About</button>';
    J("gohome").style.display = "none"
}
function Ja () {
    x.innerHTML = "About <span class=file>BB10 / PlayBook App Manager</span> <span class=other>2.2</span>";
    y.innerHTML = '<span id=about>Copyright &copy; 2012 George J (&#x6a;&#x67;&#x63;&#x40;&#x67;&#x72;&#x69;&#x64;&#x62;&#x6f;&#x6f;&#x6b;&#x2e;&#x6f;&#x72;&#x67;)<br>Software Homepage: <a href="http://gridbook.org/pb-app-mgr/" target="_blank">http://gridbook.org/pb-app-mgr/</a><br>Your donations will make me feel warm and fuzzy and thus keep this app alive/updated. If you like this app and want to show your appreciation of my work, please donate to <span class=ok>&#x6a;&#x67;&#x63;&#x40;&#x67;&#x72;&#x69;&#x64;&#x62;&#x6f;&#x6f;&#x6b;&#x2e;&#x6f;&#x72;&#x67;</span> via PayPal. (Choose Personal instead of Purchase)<br>Distributed under the <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank">Creative Commons BY-NC-SA License</a>.<br>JavaScript libraries of SHA-512 and MD5 are originally implemented by <a href="http://pajhome.org.uk/crypt/md5/index.html" target="_blank">Paul Johnston</a>.</span>';
    J("gohome").style.display = "inline-block"
}
u.k = function (b) {
    b && (this[0] = null);
    !this[0] && 1 < this.length && (this.shift(),
        setTimeout(Ba.bind(this[0][1], this[0][0], 0), b ? 1E3 : 0));
    this.list()
}
    ;
u.list = function () {
    var b = "";
    if (this[0]) {
        for (var d = 0, e = this.length; d < e; ++d)
            b += (d ? d + 1 + ": " : "=> ") + this[d][0] + " <span class=file>" + this[d][1].name + "</span> <span class='err pointer' title='" + (d ? "remove" : "abort") + "' onclick='u.remove(" + d + ")'>[X]</span>\n";
        J("fbtn").innerHTML = "Queue (" + this.length + ")";
        J("qlist").innerHTML = b;
        document.title = "[" + this.length + "] " + this[0][1].name + " - BB10 / PlayBook App Manager"
    } else
        J("fbtn").innerHTML = "Install Apps",
            J("qlist").innerHTML = "<span class=footnote>Drag and drop files here to install</span>",
            document.title = "BB10 / PlayBook App Manager"
}
    ;
u.remove = function (b) {
    b ? (this.splice(b, 1),
        this.list()) : (this[0][2].onreadystatechange = null,
            this[0][2].abort())
}
    ;
u.j = function () {
    J("lbtn").innerHTML = v.length ? '<button class=tight onclick="Ea()">Logs (' + v.length + ")</button>" : "";
    this.k(!0)
}
    ;
function qa (b, d) {
    for (var e = "", a, f = 0, c = b.length; f < c; f++)
        a = b.charCodeAt(f),
            !d && 16 > a && (e += "0"),
            e += a.toString(16);
    return d ? e : e.toUpperCase()
}
function ra (b) {
    for (var d = Array(b.length + 3 >> 2), e = 0, a = d.length; e < a; e++)
        d[e] = 0;
    e = 0;
    for (a = b.length; e < a; e++)
        d[e >> 2] |= (b.charCodeAt(e) & 255) << (3 - e % 4 << 3);
    return d
}
function pa (b) {
    for (var d = "", e = 0, a = b.length << 2; e < a; e++)
        d += String.fromCharCode(b[e >> 2] >>> (3 - e % 4 << 3) & 255);
    return d
}
var Ka;
function oa (b, d) {
    void 0 == Ka && (Ka = [R(1116352408, -685199838), R(1899447441, 602891725), R(-1245643825, -330482897), R(-373957723, -2121671748), R(961987163, -213338824), R(1508970993, -1241133031), R(-1841331548, -1357295717), R(-1424204075, -630357736), R(-670586216, -1560083902), R(310598401, 1164996542), R(607225278, 1323610764), R(1426881987, -704662302), R(1925078388, -226784913), R(-2132889090, 991336113), R(-1680079193, 633803317), R(-1046744716, -815192428), R(-459576895, -1628353838), R(-272742522, 944711139), R(264347078, -1953704523), R(604807628, 2007800933), R(770255983, 1495990901), R(1249150122, 1856431235), R(1555081692, -1119749164), R(1996064986, -2096016459), R(-1740746414, -295247957), R(-1473132947, 766784016), R(-1341970488, -1728372417), R(-1084653625, -1091629340), R(-958395405, 1034457026), R(-710438585, -1828018395), R(113926993, -536640913), R(338241895, 168717936), R(666307205, 1188179964), R(773529912, 1546045734), R(1294757372, 1522805485), R(1396182291, -1651133473), R(1695183700, -1951439906), R(1986661051, 1014477480), R(-2117940946, 1206759142), R(-1838011259, 344077627), R(-1564481375, 1290863460), R(-1474664885, -1136513023), R(-1035236496, -789014639), R(-949202525, 106217008), R(-778901479, -688958952), R(-694614492, 1432725776), R(-200395387, 1467031594), R(275423344, 851169720), R(430227734, -1194143544), R(506948616, 1363258195), R(659060556, -544281703), R(883997877, -509917016), R(958139571, -976659869), R(1322822218, -482243893), R(1537002063, 2003034995), R(1747873779, -692930397), R(1955562222, 1575990012), R(2024104815, 1125592928), R(-2067236844, -1578062990), R(-1933114872, 442776044), R(-1866530822, 593698344), R(-1538233109, -561857047), R(-1090935817, -1295615723), R(-965641998, -479046869), R(-903397682, -366583396), R(-779700025, 566280711), R(-354779690, -840897762), R(-176337025, -294727304), R(116418474, 1914138554), R(174292421, -1563912026), R(289380356, -1090974290), R(460393269, 320620315), R(685471733, 587496836), R(852142971, 1086792851), R(1017036298, 365543100), R(1126000580, -1676669620), R(1288033470, -885112138), R(1501505948, -60457430), R(1607167915, 987167468), R(1816402316, 1246189591)]);
    var e = [R(1779033703, -205731576), R(-1150833019, -2067093701), R(1013904242, -23791573), R(-1521486534, 1595750129), R(1359893119, -1377402159), R(-1694144372, 725511199), R(528734635, -79577749), R(1541459225, 327033209)], a = R(0, 0), f = R(0, 0), c = R(0, 0), g = R(0, 0), h = R(0, 0), l = R(0, 0), m = R(0, 0), w = R(0, 0), O = R(0, 0), E = R(0, 0), q = R(0, 0), z = R(0, 0), P = R(0, 0), ia = R(0, 0), F = R(0, 0), G = R(0, 0), H = R(0, 0), p, s, za, A = Array(80);
    for (s = 0; 80 > s; s++)
        A[s] = R(0, 0);
    b[d >> 2] |= 128 << (3 - d % 4 << 3);
    b[(d + 16 >> 7 << 5) + 31] = d << 3;
    s = 0;
    for (za = b.length; s < za; s += 32) {
        S(c, e[0]);
        S(g, e[1]);
        S(h, e[2]);
        S(l, e[3]);
        S(m, e[4]);
        S(w, e[5]);
        S(O, e[6]);
        S(E, e[7]);
        for (p = 0; 16 > p; p++)
            A[p].a = b[s + 2 * p],
                A[p].b = b[s + 2 * p + 1];
        for (p = 16; 80 > p; p++) {
            T(F, A[p - 2], 19);
            La(G, A[p - 2], 29);
            var K = H
                , B = A[p - 2];
            K.b = B.b >>> 6 | B.a << 26;
            K.a = B.a >>> 6;
            z.b = F.b ^ G.b ^ H.b;
            z.a = F.a ^ G.a ^ H.a;
            T(F, A[p - 15], 1);
            T(G, A[p - 15], 8);
            K = H;
            B = A[p - 15];
            K.b = B.b >>> 7 | B.a << 25;
            K.a = B.a >>> 7;
            q.b = F.b ^ G.b ^ H.b;
            q.a = F.a ^ G.a ^ H.a;
            var K = A[p]
                , C = A[p - 7]
                , Q = A[p - 16]
                , B = (z.b & 65535) + (C.b & 65535) + (q.b & 65535) + (Q.b & 65535)
                , X = (z.b >>> 16) + (C.b >>> 16) + (q.b >>> 16) + (Q.b >>> 16) + (B >>> 16)
                , Y = (z.a & 65535) + (C.a & 65535) + (q.a & 65535) + (Q.a & 65535) + (X >>> 16)
                , C = (z.a >>> 16) + (C.a >>> 16) + (q.a >>> 16) + (Q.a >>> 16) + (Y >>> 16);
            K.b = B & 65535 | X << 16;
            K.a = Y & 65535 | C << 16
        }
        for (p = 0; 80 > p; p++)
            P.b = m.b & w.b ^ ~m.b & O.b,
                P.a = m.a & w.a ^ ~m.a & O.a,
                T(F, m, 14),
                T(G, m, 18),
                La(H, m, 9),
                z.b = F.b ^ G.b ^ H.b,
                z.a = F.a ^ G.a ^ H.a,
                T(F, c, 28),
                La(G, c, 2),
                La(H, c, 7),
                q.b = F.b ^ G.b ^ H.b,
                q.a = F.a ^ G.a ^ H.a,
                ia.b = c.b & g.b ^ c.b & h.b ^ g.b & h.b,
                ia.a = c.a & g.a ^ c.a & h.a ^ g.a & h.a,
                K = a,
                C = Ka[p],
                Q = A[p],
                B = (E.b & 65535) + (z.b & 65535) + (P.b & 65535) + (C.b & 65535) + (Q.b & 65535),
                X = (E.b >>> 16) + (z.b >>> 16) + (P.b >>> 16) + (C.b >>> 16) + (Q.b >>> 16) + (B >>> 16),
                Y = (E.a & 65535) + (z.a & 65535) + (P.a & 65535) + (C.a & 65535) + (Q.a & 65535) + (X >>> 16),
                C = (E.a >>> 16) + (z.a >>> 16) + (P.a >>> 16) + (C.a >>> 16) + (Q.a >>> 16) + (Y >>> 16),
                K.b = B & 65535 | X << 16,
                K.a = Y & 65535 | C << 16,
                U(f, q, ia),
                S(E, O),
                S(O, w),
                S(w, m),
                U(m, l, a),
                S(l, h),
                S(h, g),
                S(g, c),
                U(c, a, f);
        U(e[0], e[0], c);
        U(e[1], e[1], g);
        U(e[2], e[2], h);
        U(e[3], e[3], l);
        U(e[4], e[4], m);
        U(e[5], e[5], w);
        U(e[6], e[6], O);
        U(e[7], e[7], E)
    }
    a = Array(19);
    for (s = 0; 8 > s; s++)
        a[2 * s + 3] = e[s].a,
            a[2 * s + 4] = e[s].b;
    return a
}
function R (b, d) {
    return {
        a: b,
        b: d
    }
}
function S (b, d) {
    b.a = d.a;
    b.b = d.b
}
function T (b, d, e) {
    b.b = d.b >>> e | d.a << 32 - e;
    b.a = d.a >>> e | d.b << 32 - e
}
function La (b, d, e) {
    b.b = d.a >>> e | d.b << 32 - e;
    b.a = d.b >>> e | d.a << 32 - e
}
function U (b, d, e) {
    var a = (d.b & 65535) + (e.b & 65535)
        , f = (d.b >>> 16) + (e.b >>> 16) + (a >>> 16)
        , c = (d.a & 65535) + (e.a & 65535) + (f >>> 16);
    d = (d.a >>> 16) + (e.a >>> 16) + (c >>> 16);
    b.b = a & 65535 | f << 16;
    b.a = c & 65535 | d << 16
}
function ua (b) {
    var d = b.search(/[\da-f]{28,32}$/);
    if (0 > d)
        return b;
    for (var e = d; e < d + 4; ++e) {
        for (var a = b.slice(0, e), f = Array(a.length >> 2), c = 0; c < f.length; c++)
            f[c] = 0;
        for (c = 0; c < a.length << 3; c += 8)
            f[c >> 5] |= (a.charCodeAt(c >> 3) & 255) << (c & 31);
        c = void 0;
        c = f;
        a = a.length << 3;
        c[a >> 5] |= 128 << (a & 31);
        c[(a + 64 >>> 9 << 4) + 14] = a;
        for (var a = 1732584193, f = -271733879, g = -1732584194, h = 271733878, l = 0; l < c.length; l += 16)
            var m = a
                , w = f
                , O = g
                , E = h
                , a = V(a, f, g, h, c[l + 0], 7, -680876936)
                , h = V(h, a, f, g, c[l + 1], 12, -389564586)
                , g = V(g, h, a, f, c[l + 2], 17, 606105819)
                , f = V(f, g, h, a, c[l + 3], 22, -1044525330)
                , a = V(a, f, g, h, c[l + 4], 7, -176418897)
                , h = V(h, a, f, g, c[l + 5], 12, 1200080426)
                , g = V(g, h, a, f, c[l + 6], 17, -1473231341)
                , f = V(f, g, h, a, c[l + 7], 22, -45705983)
                , a = V(a, f, g, h, c[l + 8], 7, 1770035416)
                , h = V(h, a, f, g, c[l + 9], 12, -1958414417)
                , g = V(g, h, a, f, c[l + 10], 17, -42063)
                , f = V(f, g, h, a, c[l + 11], 22, -1990404162)
                , a = V(a, f, g, h, c[l + 12], 7, 1804603682)
                , h = V(h, a, f, g, c[l + 13], 12, -40341101)
                , g = V(g, h, a, f, c[l + 14], 17, -1502002290)
                , f = V(f, g, h, a, c[l + 15], 22, 1236535329)
                , a = W(a, f, g, h, c[l + 1], 5, -165796510)
                , h = W(h, a, f, g, c[l + 6], 9, -1069501632)
                , g = W(g, h, a, f, c[l + 11], 14, 643717713)
                , f = W(f, g, h, a, c[l + 0], 20, -373897302)
                , a = W(a, f, g, h, c[l + 5], 5, -701558691)
                , h = W(h, a, f, g, c[l + 10], 9, 38016083)
                , g = W(g, h, a, f, c[l + 15], 14, -660478335)
                , f = W(f, g, h, a, c[l + 4], 20, -405537848)
                , a = W(a, f, g, h, c[l + 9], 5, 568446438)
                , h = W(h, a, f, g, c[l + 14], 9, -1019803690)
                , g = W(g, h, a, f, c[l + 3], 14, -187363961)
                , f = W(f, g, h, a, c[l + 8], 20, 1163531501)
                , a = W(a, f, g, h, c[l + 13], 5, -1444681467)
                , h = W(h, a, f, g, c[l + 2], 9, -51403784)
                , g = W(g, h, a, f, c[l + 7], 14, 1735328473)
                , f = W(f, g, h, a, c[l + 12], 20, -1926607734)
                , a = Z(f ^ g ^ h, a, f, c[l + 5], 4, -378558)
                , h = Z(a ^ f ^ g, h, a, c[l + 8], 11, -2022574463)
                , g = Z(h ^ a ^ f, g, h, c[l + 11], 16, 1839030562)
                , f = Z(g ^ h ^ a, f, g, c[l + 14], 23, -35309556)
                , a = Z(f ^ g ^ h, a, f, c[l + 1], 4, -1530992060)
                , h = Z(a ^ f ^ g, h, a, c[l + 4], 11, 1272893353)
                , g = Z(h ^ a ^ f, g, h, c[l + 7], 16, -155497632)
                , f = Z(g ^ h ^ a, f, g, c[l + 10], 23, -1094730640)
                , a = Z(f ^ g ^ h, a, f, c[l + 13], 4, 681279174)
                , h = Z(a ^ f ^ g, h, a, c[l + 0], 11, -358537222)
                , g = Z(h ^ a ^ f, g, h, c[l + 3], 16, -722521979)
                , f = Z(g ^ h ^ a, f, g, c[l + 6], 23, 76029189)
                , a = Z(f ^ g ^ h, a, f, c[l + 9], 4, -640364487)
                , h = Z(a ^ f ^ g, h, a, c[l + 12], 11, -421815835)
                , g = Z(h ^ a ^ f, g, h, c[l + 15], 16, 530742520)
                , f = Z(g ^ h ^ a, f, g, c[l + 2], 23, -995338651)
                , a = $(a, f, g, h, c[l + 0], 6, -198630844)
                , h = $(h, a, f, g, c[l + 7], 10, 1126891415)
                , g = $(g, h, a, f, c[l + 14], 15, -1416354905)
                , f = $(f, g, h, a, c[l + 5], 21, -57434055)
                , a = $(a, f, g, h, c[l + 12], 6, 1700485571)
                , h = $(h, a, f, g, c[l + 3], 10, -1894986606)
                , g = $(g, h, a, f, c[l + 10], 15, -1051523)
                , f = $(f, g, h, a, c[l + 1], 21, -2054922799)
                , a = $(a, f, g, h, c[l + 8], 6, 1873313359)
                , h = $(h, a, f, g, c[l + 15], 10, -30611744)
                , g = $(g, h, a, f, c[l + 6], 15, -1560198380)
                , f = $(f, g, h, a, c[l + 13], 21, 1309151649)
                , a = $(a, f, g, h, c[l + 4], 6, -145523070)
                , h = $(h, a, f, g, c[l + 11], 10, -1120210379)
                , g = $(g, h, a, f, c[l + 2], 15, 718787259)
                , f = $(f, g, h, a, c[l + 9], 21, -343485551)
                , a = a + m | 0
                , f = f + w | 0
                , g = g + O | 0
                , h = h + E | 0;
        c = [a, f, g, h];
        a = "";
        for (f = 0; f < c.length << 5; f += 8)
            a += String.fromCharCode(c[f >> 5] >>> (f & 31) & 255);
        if (qa(a, !0) == b.slice(e))
            return b.slice(0, e)
    }
    return b
}
function wa (b) {
    for (var d = 0; 1024 <= b && 3 > d;)
        b /= 1024,
            d += 1;
    d && (b = 100 <= b ? b | 0 : 10 <= b ? (10 * b | 0) / 10 : (100 * b | 0) / 100);
    b += " ";
    switch (d) {
        case 1:
            b += "k";
            break;
        case 2:
            b += "M";
            break;
        case 3:
            b += "G"
    }
    return b + "B"
}
function Z (b, d, e, a, f, c) {
    b = ((d | 0) + (b | 0) | 0) + ((a | 0) + (c | 0) | 0) | 0;
    return (b << f | b >>> 32 - f | 0) + (e | 0) | 0
}
function V (b, d, e, a, f, c, g) {
    return Z(d & e | ~d & a, b, d, f, c, g)
}
function W (b, d, e, a, f, c, g) {
    return Z(d & a | e & ~a, b, d, f, c, g)
}
function $ (b, d, e, a, f, c, g) {
    return Z(e ^ (d | ~a), b, d, f, c, g)
}
ga();
