(function(h) {
"use strict";
var g = !0, l = null, n = !1;
  function x(c) {
    var b = !c.firstChild, a = 0, el;
    if(!b) {
      for(b = g;(el = c.childNodes[a++]) && b;) {
        b = 3 === el.nodeType && "" === el.nodeValue.trim()
      }
    }
    return b
  }
  function u(c, b, a) {
    var d;
    void 0 == d && (d = n);
    var e;
    d && (e = c.split("?")[1], c = c.split("?")[0]);
    h.SendRequest(c, e || "", function(a) {
      b(a.responseText)
    }, a, {post:d})
  }
  var c = h.ui = h.ja || {}, v = h.randomString, z = Function.prototype.call.bind(Object.prototype.hasOwnProperty), A = "scr" + v(5), y = Function.prototype.call.bind(Array.prototype.forEach), o = h.MicroformatError = function(c) {
    var b = this === h ? new o.H : this;
    o.superclass.constructor.apply(b, arguments);
    b.name = "MicroformatError";
    b.message = c || "";
    return b
  };
  Object.inherit(o, Error);
  o.H = function() {
  };
  c.b = {i:0, h:1, da:10, ca:11, Z:20, Y:21, W:22, X:23, ba:30, aa:31, I:32, ea:40, $:100};
  h.ResourceManager = new function() {
    function c(a, b) {
      var e;
      (e = b ? document.getElementById(b) : 0) && e.parentNode.removeChild(e);
      document.head.appendChild(e = document.createElement(a)).id = b;
      return e
    }
    var b = this;
    v(5);
    b.applications = {};
    b.u = function(a, b, e) {
      e = c("script", e);
      e.onload = b;
      e.src = a
    };
    b.v = function(a, b) {
      var e = c("link", b);
      e.setAttribute("rel", "stylesheet");
      e.setAttribute("href", a)
    };
    b.k = function(a, d, e, f) {
      var j = a.split(":"), c = "urn" === j[0], q = a.substr(j[0].length + j[1].length + 2);
      if(f) {
        f(a, d, e, q)
      }else {
        if(c) {
          switch(j[1]) {
            case "templates":
              d("", q);
              break;
            case "app":
              b.w(a, d, e, q)
          }
        }else {
          d("", q)
        }
      }
    };
    b.Q = function(a, d, e, f) {
      f ? u(f, function(a) {
        var c;
        try {
          c = JSON.parse(a)
        }catch(q) {
          return console.error("Can't parse JSON | error message: " + q.message), n
        }
        (a = c.css) && a.forEach(function(a) {
          b.v(a)
        });
        (c = c.html) ? d(c, f) : (console.error("No 'html' in json object"), e())
      }, function() {
        e("Error", f)
      }) : b.k(a, d, e, b.Q)
    };
    b.w = function(a, d, e, f) {
      f ? b.applications[f] ? d(b.applications[f], f) : u(f + "/index.json", function(a) {
        var e;
        if("object" != typeof a) {
          try {
            e = JSON.parse(a)
          }catch(c) {
            return console.error("Can't parse JSON | error message: " + c.message), n
          }
        }else {
          e = a
        }
        b.applications[f] = e;
        d(e, f)
      }, function() {
        e("Error", f)
      }) : b.k(a, d, e, b.w)
    };
    b.z = function(a, d, e, f) {
      f ? u(f, function(a) {
        d(a, f)
      }, function() {
        e("Error", f)
      }) : b.k(a, d, e, b.z)
    }
  };
  var m = c.WAElement = function(h, b) {
    m.L(h);
    ++m.J;
    this.g = {t:"select"};
    this.l = {};
    this.a = h;
    this.V = b ? b instanceof c.WebApplication ? b : b.V : l;
    this.init = m.prototype.init
  }, k = m.prototype;
  k.init = function() {
    if(this.O) {
      return n
    }
    var c = this.a;
    if("onlifeschema.org/WebApplication" != this.c && x(c)) {
      return n
    }
    c.id || (c.id = v(9) + "_");
    this.M(this.a);
    for(var b in this.m) {
      c.addEventListener(b, this, n)
    }
    this.r = this.a.properties;
    return this.O = g
  };
  k.handleEvent = function(c) {
    function b(a, b) {
      var d;
      a.forEach(function(a) {
        d !== n && (d = a.call(this, c, a, this))
      }, b)
    }
    var a = c.type, d = this.l[a];
    for(d && b(d, this);(a = "@" + a) in this;) {
      (d = this[a]) && b(d, this)
    }
  };
  k.addEvent = function(c, b) {
    var a = this.l[c];
    a || (a = this.l[c] = [], this.a.addEventListener(c, this, n));
    a.push(b)
  };
  k.removeEvent = function() {
  };
  k.c = "onlifeschema.org/WAElement";
  k.show = function() {
    this.a.dispatchEvent(new CustomEvent(c.b.i, {bubbles:n}))
  };
  k.hide = function() {
    this.a.dispatchEvent(new CustomEvent(c.b.h, {bubbles:n}))
  };
  k.M = function b(a) {
    var a = a.properties.component, d = this;
    if(a && 0 !== a.length) {
      for(var e = -1, c, j;c = a[++e];) {
        c.hasAttribute("itemscope") && (j = c.getAttribute("itemtype"), j.split(/\s+/).forEach(function(a) {
          var e = MicroformatConstructors[a];
          e ? (new e(c, d)).init() : (console.info("unkonown component type : " + a), b.call(d, c))
        }))
      }
    }
  };
  k.m = [];
  m.J = 0;
  m.addEvent = function(b, a) {
    var d = this, d = !d || d == h ? k : d.prototype, e = "@" + b;
    if(z(d, e)) {
      d[e].push(a)
    }else {
      for(;e in d;) {
        e = "@" + e
      }
      d[e] ? d[e].push(a) : (~k.m.indexOf(b) || k.m.push(b), d[e] = [a])
    }
  };
  m.removeEvent = function() {
  };
  m.L = function(b) {
    if(b.getAttribute("itemscope") === l) {
      throw o("itemscope attribute need");
    }
    var a = b.getAttribute("itemtype");
    if(a === l) {
      throw o("itemscope attribute need");
    }
    if(~a.split(/\s+/).indexOf(b.c)) {
      throw o("element must implement '" + b.c + "' microdata type except of '" + a + "'");
    }
  };
  m.addEvent(c.b.i, function() {
    var b = this.a.getAttribute("style");
    b && (b = b.replace(": ", ":").replace(" :", ":").replace("display:none", ""), this.a.setAttribute("style", b));
    this.a.classList.add(this.g.t)
  });
  m.addEvent(c.b.h, function(b) {
    this.a.classList.remove(this.g.t);
    b.stopPropagation()
  });
  var w = c.WAForm = function(b, a) {
    function d(a) {
      var b = a.target;
      "FORM" != b.tagName.toUpperCase() && (b = b.form);
      if(!b) {
        return a.stopPropagation(), a.preventDefault(), n
      }
      var e = b.action;
      if(e) {
        var d = e.split("?")[1];
        if(d) {
          d = d.replace(/\{\[(.*?)\]\}/gi, function(a, e) {
            return b[e] ? b[e].value : ""
          })
        }else {
          for(var c = -1, f;f = b[++c];) {
            d += (0 == c ? "" : "&") + f.name + "=" + f.value
          }
        }
        h.G && console.log(e + "?" + d)
      }
      a.preventDefault();
      return n
    }
    var e = this;
    w.superclass.constructor.apply(e, arguments);
    var c = e.init;
    e.init = function() {
      if(!c.apply(e, arguments)) {
        return n
      }
      e.a.addEventListener("submit", d, n)
    }
  };
  Object.inherit(w, c.WAElement);
  w.prototype.c = "onlifeschema.org/WAForm";
  var i = c.WAMenu = function(b) {
    var a = this;
    i.superclass.constructor.apply(a, arguments);
    var d, e = bubbleEventListener(i.R, function(b, e, c) {
      d && d.classList.remove("select");
      (d = e).classList.add("select");
      b = new CustomEvent(a.A, {bubbles:g, cancelable:g, detail:c});
      a.a.dispatchEvent(b);
      return n
    });
    a.A = a.a.getAttribute(i.B);
    var c = a.init;
    a.init = function() {
      if(c.apply(a, arguments) === n) {
        return n
      }
      !a.A && h.G && console.error("WAMenu element must have value in '" + i.B + "' attribute");
      var b = a.a.getAttribute(i.S) || i.C[a.a.tagName.toUpperCase()] || i.C["*"];
      a.a.addEventListener(b, e, n);
      Array.from(a.a.r.menuItem).forEach(function(a) {
        d || a.classList.contains("select") && (d = a)
      })
    }
  };
  Object.inherit(i, c.WAElement);
  i.B = "data-menu-event";
  i.R = "data-menu-detail";
  i.S = "data-trigger-event";
  i.C = {"*":"click", FORM:"submit"};
  i.prototype.c = "onlifeschema.org/WAMenu";
  var p = c.WATabs = function(b) {
    var a = this;
    p.superclass.constructor.apply(a, arguments);
    a.f = l;
    a.s = 0;
    a.e = -1;
    var d = a.init;
    a.init = function() {
      if(d.apply(a, arguments) === n) {
        return n
      }
      a.N(a.a);
      a.f = Array.from(a.a.properties.tab);
      a.s = a.f.length;
      a.f.forEach(function(b, d) {
        b.classList.contains("select") && (a.e = d);
        b.addEventListener(c.b.i, function() {
          if(a.e != d) {
            a.a.n = d
          }
          this.classList.add("select")
        });
        b.addEventListener(c.b.h, function(a) {
          this.classList.remove("select");
          a.stopPropagation()
        })
      });
      a.a.addEventListener("tabchange", function(b) {
        var d = a.f[b.prevTab], j = a.f[b.currentTab];
        d && d.dispatchEvent(new CustomEvent(c.b.h, {bubbles:n, cancelable:g}));
        j && j.dispatchEvent(new CustomEvent(c.b.i, {bubbles:g, cancelable:g}));
        b.stopPropagation()
      });
      a.a.addEventListener(c.b.I, function(b) {
        var d = parseInt(b.detail);
        !isNaN(d) && a.a.n != d && (a.a.n = d);
        b.stopPropagation()
      });
      a.a.n = a.e
    }
  };
  Object.inherit(p, c.WAElement);
  p.prototype.c = "onlifeschema.org/WATabs";
  p.prototype.T = function(b) {
    var a = this.e, d = new CustomEvent("tabchange", {bubbles:g, cancelable:g});
    b >= this.f.length ? b = this.f.length - 1 : 0 > b && (b = 0);
    this.e = d.currentTab = b;
    d.prevTab = a;
    this.a.dispatchEvent(d)
  };
  p.prototype.N = function(b) {
    var a = this;
    Object.defineProperties(b, {currentTab:{get:function() {
      return a.e
    }, set:function(b) {
      isNaN(b = parseInt(b)) || a.T(b);
      return a.e
    }}, tabCount:{get:function() {
      return a.s
    }}});
    b.getcurrentTab && b.addBehavior && b.addBehavior("class.ui.WATabs.ielt8.htc")
  };
  p.addEvent = c.WAElement.addEvent;
  p.removeEvent = c.WAElement.removeEvent;
  var s = c.WebApplication = function(b, a) {
    var d = this;
    s.superclass.constructor.apply(d, arguments);
    d.ga = l;
    d.fa = {status:{ia:n}};
    var c = d.init;
    d.init = function() {
      if(c.apply(d, arguments) === n) {
        return n
      }
      var a = b.getAttribute("itemid");
      if("urn" === (a || "").split(":")[0] && !d.U) {
        return h.ResourceManager.k(a, function(c, e) {
          function i(a, b) {
            "object" == typeof c && (new c.app(a)).init(b)
          }
          function k(a, b) {
            var c = document.createDocumentFragment(), d = c.appendChild(document.createElement("div"));
            d.innerHTML = a;
            d = d.firstChild;
            for(y(d.attributes, function(a) {
              "class" == a.name && y(d.classList, function(a) {
                b.classList.add(a)
              });
              b.setAttribute(a.name, a.value)
            });c = d.childNodes[0];) {
              b.appendChild(c)
            }
            d.innerHTML = "";
            c = d = l
          }
          d.P(c, e, function() {
            x(b) ? "object" == typeof c ? c.html ? h.ResourceManager.z(a + "/" + c.html, function(e) {
              "" == e ? console.error("Empty answer for '" + a + "' request") : (k(e, b), i(c, b), d.init())
            }, function() {
              console.error("Some error fired while sending '" + a + "' request")
            }) : console.error("Need `html` teamplete in 'html' property") : (k(c, b), i(c, b), d.init()) : i(c, b)
          })
        }), d.U = g, n
      }
    }
  };
  Object.inherit(s, c.WAElement);
  s.prototype.c = "onlifeschema.org/WebApplication";
  s.prototype.q = function(b, a) {
    return"/" == b.charAt(0) ? b : /^http(s?)\:\/\//ig.test(b) ? b : a + "/" + b
  };
  s.prototype.P = function(b, a, c) {
    var e = this, f, j, i;
    if("object" != typeof b) {
      try {
        f = JSON.parse(b)
      }catch(k) {
        console.error("Can't parse JSON | error message: " + k.message);
        return
      }
    }else {
      f = b
    }
    j = f.id;
    (b = f.css) && b.forEach(function(b, c) {
      i = "style_" + j + "_" + c;
      document.getElementById(i) || h.ResourceManager.v(e.q(b, a), l)
    });
    (b = f.js) && b.forEach(function(b, c) {
      i = "script_" + j + "_" + c;
      document.getElementById(i) || h.ResourceManager.u(e.q(b, a), l, i)
    });
    f.app && ("object" == typeof f.app ? (Object.extend(f, f.app), c()) : "function" == typeof f.app ? c() : h.ResourceManager.u(e.q(f.app, a), function() {
      var b = h.exports;
      b ? (Object.extend(f, b), h.ResourceManager.applications[a] = f, delete h.exports, h.exports = l, c()) : console.info("Application '" + j + "' has no exported functions")
    }, j ? A + j : 0))
  };
  var t = c.ImageGallery = function(b) {
    var a = this;
    t.superclass.constructor.apply(a, arguments);
    a.j = 0;
    a.d = -1;
    var c = a.init;
    a.init = function() {
      if(c.apply(a, arguments) === n) {
        return n
      }
      a.o = a.r.primaryImageOfPage[0];
      a.images = a.r.associatedMedia;
      a.j = a.images.length;
      a.a.addEventListener("showimage", function(b) {
        var c = a.images[a.d], d = b.detail;
        c && c.classList.remove("select");
        d && (d.classList.add("select"), a.d = Array.from(a.images).indexOf(d));
        0 > a.d || !d ? (a.d = 0, d = Array.from(a.images)[0]) : a.d >= a.j && (a.d = a.j - 1, d = Array.from(a.images)[a.d]);
        a.o.properties.contentURL[0].itemValue = d.properties.contentURL[0].itemValue;
        a.o.properties.caption[0].itemValue = d.properties.caption[0].itemValue;
        a.o.properties.description[0].itemValue = d.properties.description[0].itemValue;
        b.stopPropagation()
      });
      Array.from(a.images).forEach(function(b) {
        b.addEventListener("click", a.p, n);
        b.addEventListener("touchstart", a.p, n);
        b.addEventListener("touchend", a.p, n);
        b.classList.contains("select") && b.dispatchEvent(new Event("click"))
      })
    }
  };
  Object.inherit(t, c.WAElement);
  t.prototype.c = "schema.org/ImageGallery";
  t.prototype.p = function() {
    this.dispatchEvent(new CustomEvent("showimage", {bubbles:g, cancelable:g, detail:this}))
  };
  var r = c.SlideShow = function(b) {
    r.superclass.constructor.apply(this, arguments);
    this.K = this.init;
    this.g.D = 5E3;
    this.init = r.prototype.init
  };
  Object.inherit(r, c.ImageGallery);
  r.prototype.c = "onlifeschema.org/SlideShow";
  r.prototype.init = function() {
    var b = this;
    if(b.K.apply(b, arguments) === n) {
      return n
    }
    b.a.addEventListener("showimage", function() {
      clearInterval(b._interval);
      b._interval = setInterval(b.F.bind(b), b.g.D)
    });
    b._interval = setInterval(b.F.bind(b), b.g.D)
  };
  r.prototype.F = function() {
    var b = this.d + 1;
    b >= this.j && (b = 0);
    this.images[b].dispatchEvent(new Event("click"))
  };
  h.MicroformatConstructors = {"onlifeschema.org/WebApplication":c.WebApplication, "onlifeschema.org/WAElement":c.WAElement, "onlifeschema.org/WATabs":c.WATabs, "onlifeschema.org/WAMenu":c.WAMenu, "onlifeschema.org/WAForm":c.WAForm, "schema.org/ImageGallery":c.ImageGallery, "onlifeschema.org/SlideShow":c.SlideShow}
})(window);
