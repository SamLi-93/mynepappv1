if (!window.nice || typeof nice !== "function") {
    var nice = function(g) {
        function t(a) {
            return a in r ? r[a] : r[a] = RegExp("(^|\\s)" + a + "(\\s|$)")
        }
        function n(a) {
            for (var c = 0; c < a.length; c++) {
                a.indexOf(a[c]) != c && a.splice(c, 1)
            }
            return a
        }
        function u(a, c) {
            var b = [];
            if (a == f) {
                return b
            }
            for (; a; a = a.nextSibling) {
                a.nodeType == 1 && a !== c && b.push(a)
            }
            return b
        }
        function m() {}
        function A(a, c, b, e) {
            c = w(c);
            if (c.ns) {
                var d = RegExp("(?:^| )" + c.ns.replace(" ", " .* ?") + "(?: |$)")
            }
            return (o[a._nicemid || (a._nicemid = s++)] || []).filter(function(a) {
                return a && (!c.e || a.e == c.e) && (!c.ns || d.test(a.ns)) && (!b || a.fn == b || typeof a.fn === "function" && typeof b === "function" && "" + a.fn === "" + b) && (!e || a.sel == e)
            })
        }
        function w(a) {
            a = ("" + a).split(".");
            return {
                e: a[0],
                ns: a.slice(1).sort().join(" ")
            }
        }
        function x(a, c, b) {
            d.isObject(a) ? d.each(a, b) : a.split(/\s/).forEach(function(a) {
                b(a, c)
            })
        }
        function p(a, c, b, e, f) {
            var i = a._nicemid || (a._nicemid = s++)
              , g = o[i] || (o[i] = []);
            x(c, b, function(b, c) {
                var i = f && f(c, b)
                  , j = i || c
                  , y = function(b) {
                    var c = j.apply(a, [b].concat(b.data));
                    c === !1 && b.preventDefault();
                    return c
                }
                  , i = d.extend(w(b), {
                    fn: c,
                    proxy: y,
                    sel: e,
                    del: i,
                    i: g.length
                });
                g.push(i);
                a.addEventListener(i.e, y, !1)
            })
        }
        function q(a, c, b, e) {
            var d = a._nicemid || (a._nicemid = s++);
            x(c || "", b, function(b, c) {
                A(a, b, c, e).forEach(function(b) {
                    delete o[d][b.i];
                    a.removeEventListener(b.e, b.proxy, !1)
                })
            })
        }
        function B(a) {
            var c = d.extend({
                originalEvent: a
            }, a);
            d.each(C, function(b, e) {
                c[b] = function() {
                    this[e] = D;
                    return a[b].apply(a, arguments)
                }
                ;
                c[e] = E
            });
            return c
        }
        var f, j = g.document, k = [], F = k.slice, r = [], G = 1, H = /^\s*<(\w+)[^>]*>/, l = function(a, c) {
            this.length = 0;
            if (a) {
                if (a instanceof l && c == f) {
                    return a
                } else {
                    if (d.isFunction(a)) {
                        return d(j).ready(a)
                    } else {
                        if (d.isArray(a) && a.length != f) {
                            for (var b = 0; b < a.length; b++) {
                                this[this.length++] = a[b]
                            }
                            return this
                        } else {
                            if (d.isObject(a) && d.isObject(c)) {
                                if (a.length == f) {
                                    a.parentNode == c && (this[this.length++] = a)
                                } else {
                                    for (b = 0; b < a.length; b++) {
                                        a[b].parentNode == c && (this[this.length++] = a[b])
                                    }
                                }
                                return this
                            } else {
                                if (d.isObject(a) && c == f) {
                                    return this[this.length++] = a,
                                    this
                                } else {
                                    if (c !== f) {
                                        if (c instanceof l) {
                                            return c.find(a)
                                        }
                                    } else {
                                        c = j
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                return this
            }
            if (b = this.selector(a, c)) {
                if (d.isArray(b)) {
                    for (var e = 0; e < b.length; e++) {
                        this[this.length++] = b[e]
                    }
                } else {
                    this[this.length++] = b
                }
            }
            return this
        }
        , d = function(a, c) {
            return new l(a,c)
        }
        ;
        d.each = function(a, c) {
            var b;
            if (d.isArray(a)) {
                for (b = 0; b < a.length; b++) {
                    if (c(b, a[b]) === !1) {
                        break
                    }
                }
            } else {
                if (d.isObject(a)) {
                    for (b in a) {
                        if (a.hasOwnProperty(b) && c(b, a[b]) === !1) {
                            break
                        }
                    }
                }
            }
            return a
        }
        ;
        d.extend = function(a) {
            a == f && (a = this);
            if (arguments.length === 1) {
                for (var c in a) {
                    this[c] = a[c]
                }
                return this
            } else {
                F.call(arguments, 1).forEach(function(b) {
                    for (var c in b) {
                        a[c] = b[c]
                    }
                })
            }
            return a
        }
        ;
        d.isArray = function(a) {
            return a != f && a instanceof Array && a.push != f
        }
        ;
        d.isFunction = function(a) {
            return a != f && typeof a === "function"
        }
        ;
        d.isObject = function(a) {
            return a != f && typeof a === "object"
        }
        ;
        d.fn = l.prototype = {
            constructor: l,
            forEach: k.forEach,
            reduce: k.reduce,
            push: k.push,
            indexOf: k.indexOf,
            concat: k.concat,
            selector: function(a, c) {
                var b;
                try {
                    a = a.trim();
                    if (a[0] === "#" && a.indexOf(" ") === -1 && a.indexOf(">") === -1) {
                        b = c == j ? c.getElementById(a.replace("#", "")) : [].slice.call(c.querySelectorAll(a))
                    } else {
                        if (a[0] === "<" && a[a.length - 1] === ">") {
                            var e = j.createElement("div");
                            e.innerHTML = a.trim();
                            b = [].slice.call(e.childNodes)
                        } else {
                            b = [].slice.call(c.querySelectorAll(a))
                        }
                    }
                } catch (d) {}
                return b
            },
            each: function(a) {
                this.forEach(function(c, b) {
                    a.call(c, b, c)
                });
                return this
            },
            trim: function() {
                this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, "");
                return this
            },
            ready: function(a) {
                (j.readyState === "complete" || j.readyState === "loaded") && a();
                j.addEventListener("DOMContentLoaded", a, !1);
                return this
            },
            find: function(a) {
                if (this.length === 0) {
                    return f
                }
                for (var c = [], b, e = 0; e < this.length; e++) {
                    b = d(a, this[e]);
                    for (var h = 0; h < b.length; h++) {
                        c.push(b[h])
                    }
                }
                return d(n(c))
            },
            html: function(a) {
                if (this.length === 0) {
                    return f
                }
                if (a === f) {
                    return this[0].innerHTML
                }
                for (var c = 0; c < this.length; c++) {
                    this[c].innerHTML = a
                }
                return this
            },
            css: function(a, c, b) {
                b = b != f ? b : this[0];
                if (this.length === 0) {
                    return f
                }
                if (c == f && typeof a === "string") {
                    return g.getComputedStyle(b),
                    b.style[a] ? b.style[a] : g.getComputedStyle(b)[a]
                }
                for (b = 0; b < this.length; b++) {
                    if (d.isObject(a)) {
                        for (var e in a) {
                            this[b].style[e] = a[e]
                        }
                    } else {
                        this[b].style[a] = c
                    }
                }
                return this
            },
            empty: function() {
                for (var a = 0; a < this.length; a++) {
                    this[a].innerHTML = ""
                }
                return this
            },
            hide: function() {
                if (this.length === 0) {
                    return this
                }
                for (var a = 0; a < this.length; a++) {
                    if (this.css("display", null , this[a]) != "none") {
                        this[a].setAttribute("nicemOldStyle", this.css("display", null , this[a])),
                        this[a].style.display = "none"
                    }
                }
                return this
            },
            show: function() {
                if (this.length === 0) {
                    return this
                }
                for (var a = 0; a < this.length; a++) {
                    if (this.css("display", null , this[a]) == "none") {
                        this[a].style.display = this[a].getAttribute("nicemOldStyle") ? this[a].getAttribute("nicemOldStyle") : "block",
                        this[a].removeAttribute("nicemOldStyle")
                    }
                }
                return this
            },
            val: function(a) {
                if (this.length === 0) {
                    return f
                }
                if (a == f) {
                    return this[0].value
                }
                for (var c = 0; c < this.length; c++) {
                    this[c].value = a
                }
                return this
            },
            attr: function(a, c) {
                if (this.length === 0) {
                    return f
                }
                if (c === f && !d.isObject(a)) {
                    var b = this[0].getAttribute(a);
                    try {
                        b = JSON.parse(b)
                    } catch (e) {}
                    return b
                }
                c = d.isArray(c) || d.isObject(c) ? JSON.stringify(c) : c;
                for (b = 0; b < this.length; b++) {
                    if (d.isObject(a)) {
                        for (var h in a) {
                            c == null  && c !== f ? this[b].removeAttribute(h) : this[b].setAttribute(h, a[h])
                        }
                    } else {
                        c == null  && c !== f ? this[b].removeAttribute(a) : this[b].setAttribute(a, c)
                    }
                }
                return this
            },
            removeAttr: function(a) {
                for (var c = this, b = 0; b < this.length; b++) {
                    a.split(/\s+/g).forEach(function(a) {
                        c[b].removeAttribute(a)
                    })
                }
                return this
            },
            remove: function(a) {
                a = d(this).filter(a);
                if (a == f) {
                    return this
                }
                for (var c = 0; c < a.length; c++) {
                    a[c].parentNode.removeChild(a[c])
                }
                return this
            },
            addClass: function(a) {
                for (var c = 0; c < this.length; c++) {
                    var b = this[c].className
                      , e = []
                      , d = this;
                    a.split(/\s+/g).forEach(function(a) {
                        d.hasClass(a, d[c]) || e.push(a)
                    });
                    this[c].className += (b ? " " : "") + e.join(" ");
                    this[c].className = this[c].className.trim()
                }
                return this
            },
            removeClass: function(a) {
                for (var c = 0; c < this.length; c++) {
                    if (a == f) {
                        this[c].className = "";
                        break
                    }
                    var b = this[c].className;
                    a.split(/\s+/g).forEach(function(a) {
                        b = b.replace(t(a), " ")
                    });
                    this[c].className = b.length > 0 ? b.trim() : ""
                }
                return this
            },
            hasClass: function(a, c) {
                if (this.length === 0) {
                    return !1
                }
                c || (c = this[0]);
                return t(a).test(c.className)
            },
            insertBefore: function(a, c) {
                if (this.length == 0) {
                    return this
                }
                a = d(a).get(0);
                if (!a || a.length == 0) {
                    return this
                }
                for (var b = 0; b < this.length; b++) {
                    c ? a.parentNode.insertBefore(this[b], a.nextSibling) : a.parentNode.insertBefore(this[b], a)
                }
                return this
            },
            append: function(a, c) {
                if (a && a.length != f && a.length === 0) {
                    return this
                }
                if (d.isArray(a) || d.isObject(a)) {
                    a = d(a)
                }
                var b;
                for (b = 0; b < this.length; b++) {
                    if (a.length && typeof a != "string") {
                        for (var a = d(a), e = 0; e < a.length; e++) {
                            c != f ? this[b].insertBefore(a[e], this[b].firstChild) : this[b].appendChild(a[e])
                        }
                    } else {
                        e = H.test(a) ? d(a).get() : f;
                        if (e == f || e.length == 0) {
                            e = j.createTextNode(a)
                        }
                        e.nodeName != f && e.nodeName.toLowerCase() == "script" && (!e.type || e.type.toLowerCase() === "text/javascript") ? g.eval(e.innerHTML) : c != f ? this[b].insertBefore(e, this[b].firstChild) : this[b].appendChild(e)
                    }
                }
                return this
            },
            width: function() {
                return parseInt(this[0].clientWidth)
            },
            height: function() {
                return parseInt(this[0].clientHeight)
            },
            animate: function(params, option) {
                totalLength = params.left;
                totalWidth = params.width;
                this.attr("style", "width:" + totalWidth + "px;left:" + totalLength + "px")
            },
            get: function(a) {
                a = a == f ? 0 : a;
                a < 0 && (a += this.length);
                return this[a] ? this[a] : f
            },
            children: function(a) {
                if (this.length == 0) {
                    return f
                }
                for (var c = [], b = 0; b < this.length; b++) {
                    c = c.concat(u(this[b].firstChild))
                }
                return this.setupOld(d(c).filter(a))
            },
            filter: function(a) {
                if (this.length == 0) {
                    return f
                }
                if (a == f) {
                    return this
                }
                for (var c = [], b = 0; b < this.length; b++) {
                    var e = this[b];
                    e.parentNode && d(a, e.parentNode).indexOf(e) >= 0 && c.push(e)
                }
                return this.setupOld(d(n(c)))
            },
            data: function(a, c) {
                return this.attr("data-" + a, c)
            },
            end: function() {
                return this.oldElement != f ? this.oldElement : d()
            },
            size: function() {
                return this.length
            }
        };
        var z = {
            type: "GET",
            beforeSend: m,
            success: m,
            error: m,
            complete: m,
            context: f,
            timeout: 0,
            crossDomain: !1,
            headers: {}
        };
        d.ajax = function(a) {
            var c;
            try {
                c = new g.XMLHttpRequest;
                var b = a || {}, e;
                for (e in z) {
                    b[e] || (b[e] = z[e])
                }
                if (!b.contentType) {
                    b.contentType = "application/x-www-form-urlencoded"
                }
                if (b.dataType) {
                    switch (b.dataType) {
                    case "json":
                        b.dataType = "application/json";
                        break;
                    case "text":
                        b.dataType = "text/plain";
                        break;
                    default:
                        b.dataType = "text/html";
                        break
                    }
                } else {
                    b.dataType = "text/html"
                }
                if (d.isObject(b.data)) {
                    b.data = d.param(b.data)
                }
                b.type.toLowerCase() === "get" && b.data && (b.url += b.url.indexOf("?") === -1 ? "?" + b.data : "&" + b.data);
                if (/=\?/.test(b.url)) {
                    return d.jsonP(b)
                }
                if (!b.crossDomain) {
                    b.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(b.url) && RegExp.$2 != g.location.host
                }
                if (!b.crossDomain) {
                    b.headers = d.extend({
                        "X-Requested-With": "XMLHttpRequest"
                    }, b.headers)
                }
                var f, i = b.context, j = /^([\w-]+:)\/\//.test(b.url) ? RegExp.$1 : g.location.protocol;
                c.onreadystatechange = function() {
                    var a = b.dataType;
                    if (c.readyState === 4) {
                        clearTimeout(f);
                        var d, e = !1;
                        if (c.status >= 200 && c.status < 300 || c.status === 0 && j == "file:") {
                            if (a === "application/json" && !/^\s*$/.test(c.responseText)) {
                                try {
                                    d = JSON.parse(c.responseText)
                                } catch (g) {
                                    e = g
                                }
                            } else {
                                d = c.responseText
                            }
                            c.status === 0 && d.length === 0 && (e = !0);
                            e ? b.error.call(i, c, "parsererror", e) : b.success.call(i, d, "success", c)
                        } else {
                            e = !0,
                            b.error.call(i, c, "error")
                        }
                        b.complete.call(i, c, e ? "error" : "success")
                    }
                }
                ;
                c.open(b.type, b.url, !0);
                if (b.contentType) {
                    b.headers["Content-Type"] = b.contentType
                }
                for (var k in b.headers) {
                    c.setRequestHeader(k, b.headers[k])
                }
                if (b.beforeSend.call(i, c, b) === !1) {
                    return c.abort(),
                    !1
                }
                b.timeout > 0 && (f = setTimeout(function() {
                    c.onreadystatechange = m;
                    c.abort();
                    b.error.call(i, c, "timeout")
                }, b.timeout));
                c.send(b.data)
            } catch (l) {
                console.log(l)
            }
            return c
        }
        ;
        d.get = function(a, c) {
            return this.ajax({
                url: a,
                success: c
            })
        }
        ;
        d.post = function(a, c, b, d) {
            typeof c === "function" && (b = c,
            c = {});
            d === f && (d = "html");
            return this.ajax({
                url: a,
                type: "POST",
                data: c,
                dataType: d,
                success: b
            })
        }
        ;
        d.getJSON = function(a, c, b) {
            typeof c === "function" && (b = c,
            c = {});
            return this.ajax({
                url: a,
                data: c,
                success: b,
                dataType: "json"
            })
        }
        ;
        d.param = function(a, c) {
            var b = [];
            if (a instanceof l) {
                a.each(function() {
                    b.push((c ? c + "[]" : this.id) + "=" + encodeURIComponent(this.value))
                })
            } else {
                for (var e in a) {
                    var f = c ? c + "[" + e + "]" : e
                      , g = a[e];
                    b.push(d.isObject(g) ? d.param(g, f) : f + "=" + encodeURIComponent(g))
                }
            }
            return b.join("&")
        }
        ;
        d.parseJSON = function(a) {
            return JSON.parse(a)
        }
        ;
        if (typeof String.prototype.trim !== "function") {
            String.prototype.trim = function() {
                this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, "");
                return this
            }
        }
        var o = {}
          , s = 1
          , I = {};
        d.event = {
            add: p,
            remove: q
        };
        d.fn.bind = function(a, c) {
            for (var b = 0; b < this.length; b++) {
                p(this[b], a, c)
            }
            return this
        }
        ;
        return d
    }(window);
    "$" in window || (window.$ = nice)
}
function touchEvent(b) {
    $(b).bind("touchstart", function() {
        $(b).removeClass("active");
        $(this).addClass("active")
    });
    $(b).bind("mouseover", function() {
        $(b).removeClass("active");
        $(this).addClass("active")
    })
}
function touchEvent2(b) {
    $(b).bind("touchstart", function() {
        $(b).removeClass("active");
        $(this).addClass("active")
    });
    $(b).bind("touchend", function() {
        $(b).removeClass("active")
    })
}
function changeTab(i) {
    if (i.className == "current") {
        return
    }
    var j = document.getElementsByClassName("current")[0];
    j.className = "";
    i.className = "current";
    var g = "div_" + j.id.substr(4);
    var k = "div_" + i.id.substr(4);
    var h = $("#" + g);
    var l = $("#" + k);
    h.hide();
    l.show()
}
$("img").bind("error", function() {
    $(this).attr("src", "http://mobi.zhangyue.com/i/l/jpg/7296/0000000.jpg")
});
var ZY = {};
ZY.cookie = {};
ZY.cookie.set = function(b, c, a) {
    var d = new Date();
    d.setDate(d.getDate() + a);
    document.cookie = b + "=" + escape(c) + ((a == null ) ? "" : ";expires=" + d.toGMTString())
}
;
ZY.cookie.get = function(a) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(a + "=");
        if (c_start != -1) {
            c_start = c_start + a.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return null 
}
;
var Lazy = {
    Img: null ,
    getY: function(b) {
        var a = 0;
        if (b && b.offsetParent) {
            while (b.offsetParent) {
                a += b.offsetTop;
                b = b.offsetParent
            }
        } else {
            if (b && b.y) {
                a += b.y
            }
        }
        return a
    },
    scrollY: function() {
        var a = document.documentElement;
        return self.pageYOffset || (a && a.scrollTop) || document.body.scrollTop || 0
    },
    windowHeight: function() {
        var a = document.documentElement;
        return self.innerHeight || (a && a.clientHeight) || document.body.clientHeight
    },
    CurrentHeight: function() {
        return Lazy.scrollY() + Lazy.windowHeight()
    },
    Load: function() {
        if (Lazy.Img == null ) {
            Lazy.Init()
        }
        var b = Lazy.CurrentHeight();
        for (_index = 0; _index < Lazy.Img.length; _index++) {
            if ($(Lazy.Img[_index]).attr("lazy") == undefined) {
                $(Lazy.Img[_index]).attr("lazy", "n")
            }
            if ($(Lazy.Img[_index]).attr("lazy") == "y") {
                continue
            }
            $(Lazy.Img[_index]).bind("error", function() {
                if (this.id == "subject") {
                    $(this).attr("src", "")
                } else {
                    $(this).attr("src", "http://mobi.zhangyue.com/i/l/jpg/7296/0000000.jpg")
                }
            });
            var a = Lazy.getY(Lazy.Img[_index]);
            if (a < b) {
                if (Lazy.Img[_index].getAttribute("data-src"))
                    Lazy.Img[_index].src = Lazy.Img[_index].getAttribute("data-src");
                $(Lazy.Img[_index]).attr("lazy", "y")
            }
        }
    },
    Init: function() {
        var a = document.getElementsByTagName("img");
        Lazy.Img = a
    },
    Test: function() {
        Lazy.Init();
        alert(Lazy.CurrentHeight())
    }
};
var Charm = window.C = window.Charm = {};
(function(a) {
    a.sessionStorage = {
        set: function(b, e) {
            sessionStorage.setItem(b, e)
        },
        get: function(b) {
            return sessionStorage.getItem(b)
        },
        has: function(b) {
            return sessionStorage.getItem(b) != null 
        },
        del: function(b) {
            sessionStorage.removeItem(b)
        }
    }
})(Charm);
function onReady() {
    key_html = "list_" + window.location.href;
    key_height = "list_height" + window.location.href;
    key_hasMore = "list_more" + window.location.href;
    key_page = "list_page" + window.location.href;
    key_total_page = "list_total_page" + window.location.href;
    html = Charm.sessionStorage.get(key_html);
    if (html != null ) {
        innerMoreHtml(html);
        $("#viewMore").attr("page", (parseInt(Charm.sessionStorage.get(key_page)) + 1));
        $("#viewMore").attr("total_page", (parseInt(Charm.sessionStorage.get(key_total_page))))
    }
    if (html != null  && Charm.sessionStorage.get(key_hasMore) == "false") {
        $("#viewMore").hide()
    }
}
function VisitInfo(a) {
    var a = a;
    this.visitBook = function(b) {
        window.location.href = "?key=17W" + b + "&" + a
    }
    ;
    this.loadMore = function(d, e) {
        var e = $("#viewMore").attr("page");
        var c = $("#viewMore").attr("total_page");
        var f = $("#viewMore");
        var b = '获取中&nbsp;<img id="viewMoreLoading" style="margin-bottom:-4px" src="./img/loading.gif"></img>';
        f.html(b);
        url = d + e + "&" + a;
        $.ajax({
            type: "get",
            url: url,
            timeout: 3000,
            success: function(h) {
                var g = h;
                if (f) {
                    f.hide()
                }
                innerMoreHtml(g);
                hasMore = false;
                if (parseInt(e) < parseInt(c)) {
                    f.empty();
                    f.html('<span id="viewMoreTip" class="more yellow">更多</span>');
                    f.show();
                    $("#viewMore").attr("page", (parseInt(e) + 1));
                    hasMore = true
                }
                saveMoreHtml(g, hasMore, e, c)
            },
            error: function(h, g) {
                f.html('<span id="viewMoreTip" class="more yellow">更多</span>')
            }
        })
    }
}
function innerMoreHtml(b) {
    var a = nice(b);
    $(".book-items").append(a)
}
function saveMoreHtml(a, e, d, b) {
    key_html = "list_" + window.location.href;
    key_height = "list_height" + window.location.href;
    key_hasMore = "list_more" + window.location.href;
    key_page = "list_page" + window.location.href;
    key_total_page = "list_total_page" + window.location.href;
    a = Charm.sessionStorage.get(key_html) != null  ? Charm.sessionStorage.get(key_html) + a : a;
    Charm.sessionStorage.set(key_html, a);
    var c = document.body.scrollTop + document.documentElement.scrollTop;
    Charm.sessionStorage.set(key_height, c);
    Charm.sessionStorage.set(key_hasMore, e);
    Charm.sessionStorage.set(key_page, d);
    Charm.sessionStorage.set(key_total_page, b)
}
addEventListener("load", function() {
    setTimeout(function() {
        window.scrollTo(0, 1)
    }, 100)
});
function isPhone(b) {
    if (b.length != 11) {
        return false
    }
    var a = /^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1}|147|145|(17[0-9]{1}))+\d{8})$/;
    if (!a.test(b)) {
        return false
    } else {
        return true
    }
}
function isMobilePhone(a) {
    if (a.length != 11) {
        return false
    }
    var b = /^(((13[4-9]{1})|15([0-2]|[7-9]){1}|18([2-3]|[7-8]){1}|147|145)+\d{8})$/;
    if (!b.test(a)) {
        return false
    }
    return true
}
function validLoginName(b) {
    var a = /^[a-zA-Z0-9]*([a-z]{1}|[A-Z]{1})[a-zA-Z0-9]*$/;
    if (!a.test(b)) {
        return false
    } else {
        return true
    }
}
function isNum(b) {
    if (!b) {
        return false
    }
    var a = /^\d+(\.\d+)?$/;
    if (!a.test(b)) {
        return false
    } else {
        return true
    }
}
function isEqual(b, a) {
    if (b != a) {
        return false
    } else {
        return true
    }
}
function empty(a) {
    if (a == "") {
        return true
    } else {
        return false
    }
}
function button_hold_5seconds(c) {
    var c = $(c);
    var b = c.val();
    var a = 5;
    c.attr("disabled", "disabled");
    c.addClass("disable");
    var d = setInterval(function() {
        a--;
        if (a <= 0) {
            c.removeAttr("disabled");
            c.removeClass("disable");
            clearInterval(d);
            c.val(b)
        } else {}
    }, 1000)
}
function setLocalData(a, b) {
    if (typeof (localStorage) != "undefined") {
        localStorage.setItem(a, b)
    }
}
document.onselectstart = function() {
    return false
}
;
