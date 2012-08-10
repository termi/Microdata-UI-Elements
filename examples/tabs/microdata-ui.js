(function(j) {
var g = !0, m = null, o = !1;
  function y(h) {
    var b = !h.firstChild, a = 0;
    if(!b) {
      for(b = g;(el = h.childNodes[a++]) && b;) {
        b = 3 === el.nodeType && "" === el.nodeValue.trim()
      }
    }
    return b
  }
  function w(h, b, a) {
    var d;
    void 0 == d && (d = o);
    var c;
    d && (c = h.split("?")[1], h = h.split("?")[0]);
    j.SendRequest(h, c || "", function(a) {
      b(a.responseText)
    }, a, {post:d})
  }
  var e = j.R = j.R || {}, u = j.randomString, z = Function.prototype.call.bind(Object.prototype.hasOwnProperty), p = j.MicroformatError = function(h) {
    var b = this === j ? new p.C : this;
    p.superclass.constructor.apply(b, arguments);
    b.name = "MicroformatError";
    b.message = h || "";
    return b
  };
  Object.inherit(p, Error);
  p.C = function() {
  };
  e.b = {h:0, g:1, aa:10, $:11, W:20, V:21, T:22, U:23, Z:30, Y:31, D:32, ba:40, X:100};
  var A = j.ResourceManager = new function() {
    function h(a, b) {
      var c;
      (c = b ? document.getElementById(b) : 0) && c.parentNode.removeChild(c);
      document.head.appendChild(c = document.createElement(a)).id = b;
      return c
    }
    var b = this;
    u(5);
    b.applications = {};
    b.t = function(a, b, c) {
      c = h("script", c);
      c.onload = b;
      c.src = a
    };
    b.u = function(a, b) {
      var c = h("link", b);
      c.setAttribute("rel", "stylesheet");
      c.setAttribute("href", a)
    };
    b.i = function(a, d, c) {
      var f = a.split(":"), k = f[f.length - 1];
      if("urn" === f[0]) {
        switch(f[1]) {
          case "templates":
            d("", k);
            break;
          case "app":
            b.K(a, d, c, f[f.length - 1])
        }
      }else {
        d("", k)
      }
    };
    b.ia = function(a, d, c, f) {
      f ? w(f, function(a) {
        var s;
        try {
          s = JSON.parse(a)
        }catch(h) {
          return console.error("Can't parse JSON | error message: " + h.message), o
        }
        (a = s.ga) && a.forEach(function(a) {
          b.u(a)
        });
        (s = s.ha) ? d(s, f) : (console.error("No 'html' in json object"), c())
      }, function() {
        c("Error", f)
      }) : b.i(a, d, c)
    };
    b.K = function(a, d, c, f) {
      f ? b.applications[f] ? d(b.applications[f], f) : w(f + "/" + __DEFAULT_APPLICATION_FILE__, function(a) {
        var b;
        if("object" != typeof a) {
          try {
            b = JSON.parse(a)
          }catch(c) {
            return console.error("Can't parse JSON | error message: " + c.message), o
          }
        }else {
          b = a
        }
        A.ea[f] = b;
        d(b, f)
      }, function() {
        c("Error", f)
      }) : b.i(a, d, c)
    };
    b.M = function(a, d, c) {
      b.i(a, d, c)
    }
  }, i = e.WAElement = function(h, b) {
    i.G(h);
    ++i.F;
    this.A = {s:"select"};
    this.j = {};
    this.a = h;
    this.S = b ? b instanceof r ? b : b.S : m
  }, n = i.prototype;
  n.init = function() {
    if(this.J) {
      return o
    }
    var h = this.a;
    h.id || (h.id = u(9) + "_");
    this.H(this.a);
    for(var b in this.k) {
      h.addEventListener(b, this, o)
    }
    this.q = this.a.properties;
    return this.J = g
  };
  n.handleEvent = function(h) {
    function b(a, b) {
      var d;
      a.forEach(function(a) {
        d !== o && (d = a.call(this, h, a, this))
      }, b)
    }
    var a = h.type, d = this.j[a];
    for(d && b(d, this);(a = "@" + a) in this;) {
      (d = this[a]) && b(d, this)
    }
  };
  n.addEvent = function(h, b) {
    var a = this.j[h];
    a || (a = this.j[h] = [], this.a.addEventListener(h, this, o));
    a.push(b)
  };
  n.removeEvent = function() {
  };
  n.f = "onlifeschema.org/WAElement";
  n.show = function() {
    this.a.dispatchEvent(new CustomEvent(e.b.h, {bubbles:o}))
  };
  n.hide = function() {
    this.a.dispatchEvent(new CustomEvent(e.b.g, {bubbles:o}))
  };
  n.H = function b(a) {
    var a = a.properties.component, d = this;
    if(a && 0 !== a.length) {
      for(var c = -1, f, k;f = a[++c];) {
        f.hasAttribute("itemscope") && (k = f.getAttribute("itemtype"), k.split(/\s+/).forEach(function(a) {
          var c = MicroformatConstructors[a];
          c ? (new c(f, d)).init() : (console.info("unkonown component type : " + a), b.call(d, f))
        }))
      }
    }
  };
  n.k = [];
  i.F = 0;
  i.addEvent = function(b, a) {
    var d = this, d = !d || d == j ? n : d.prototype, c = "@" + b;
    if(z(d, c)) {
      d[c].push(a)
    }else {
      for(;c in d;) {
        c = "@" + c
      }
      d[c] ? d[c].push(a) : (~n.k.indexOf(b) || n.k.push(b), d[c] = [a])
    }
  };
  i.removeEvent = function() {
  };
  i.G = function(b) {
    if(b.getAttribute("itemscope") === m) {
      throw p("itemscope attribute need");
    }
    var a = b.getAttribute("itemtype");
    if(a === m) {
      throw p("itemscope attribute need");
    }
    if(~a.split(/\s+/).indexOf(b.f)) {
      throw p("element must implement '" + b.f + "' microdata type except of '" + a + "'");
    }
  };
  i.addEvent(e.b.h, function() {
    var b = this.a.getAttribute("style");
    b && (b = b.replace(": ", ":").replace(" :", ":").replace("display:none", ""), this.a.setAttribute("style", b));
    this.a.classList.add(this.A.s)
  });
  i.addEvent(e.b.g, function(b) {
    this.a.classList.remove(this.A.s);
    b.stopPropagation()
  });
  var t = e.ImageGallery = function(b) {
    var a = this;
    t.superclass.constructor.apply(a, arguments);
    a.m = 0;
    a.e = -1;
    var d = a.init;
    a.init = function() {
      if(d.apply(a, arguments) === o) {
        return o
      }
      a.n = a.q.primaryImageOfPage[0];
      a.images = a.q.associatedMedia;
      a.m = a.images.length;
      a.a.addEventListener("showimage", function(b) {
        var d = a.images[a.e], k = b.detail;
        d && d.classList.remove("select");
        k && (k.classList.add("select"), a.e = Array.from(a.images).indexOf(k));
        0 > a.e || !k ? (a.e = 0, k = Array.from(a.images)[0]) : a.e >= a.m && (a.e = a.m - 1, k = Array.from(a.images)[a.e]);
        a.n.properties.contentURL[0].itemValue = k.properties.contentURL[0].itemValue;
        a.n.properties.caption[0].itemValue = k.properties.caption[0].itemValue;
        a.n.properties.description[0].itemValue = k.properties.description[0].itemValue;
        b.stopPropagation()
      });
      Array.from(a.images).forEach(function(b) {
        b.addEventListener("click", a.o, o);
        b.addEventListener("touchstart", a.o, o);
        b.addEventListener("touchend", a.o, o);
        b.classList.contains("select") && b.dispatchEvent(new Event("click"))
      })
    }
  };
  Object.inherit(t, i);
  t.prototype.f = "schema.org/ImageGallery";
  t.prototype.o = function() {
    this.dispatchEvent(new CustomEvent("showimage", {bubbles:g, cancelable:g, detail:this}))
  };
  var v = e.WAForm = function(b, a) {
    function d(a) {
      var b = a.target;
      "FORM" != b.tagName.toUpperCase() && (b = b.form);
      if(!b) {
        return a.stopPropagation(), a.preventDefault(), o
      }
      var d = b.action;
      if(d) {
        var c = d.split("?")[1];
        if(c) {
          c = c.replace(/\{\[(.*?)\]\}/gi, function(a, c) {
            return b[c] ? b[c].value : ""
          })
        }else {
          for(var f = -1, e;e = b[++f];) {
            c += (0 == f ? "" : "&") + e.name + "=" + e.value
          }
        }
        j.B && console.log(d + "?" + c)
      }
      a.preventDefault();
      return o
    }
    var c = this;
    v.superclass.constructor.apply(c, arguments);
    var f = c.init;
    c.init = function() {
      if(!f.apply(c, arguments)) {
        return o
      }
      c.a.addEventListener("submit", d, o)
    }
  };
  Object.inherit(v, i);
  v.prototype.f = "onlifeschema.org/WAForm";
  var l = e.WAMenu = function(b) {
    var a = this, _c;
    l.superclass.constructor.apply(a, arguments);
    var d = bubbleEventListener(l.N, function(b, c, d) {
	if(_c)_c.classList.remove("select");
	(_c = c).classList.add("select");
      b = new CustomEvent(a.v, {bubbles:g, cancelable:g, detail:d});
      a.a.dispatchEvent(b);
      return o
    });
    a.v = a.a.getAttribute(l.w);
    var c = a.init;
    a.init = function() {
      if(c.apply(a, arguments) === o) {
        return o
      }
      !a.v && j.B && console.error("WAMenu element must have value in '" + l.w + "' attribute");
      var b = a.a.getAttribute(l.O) || l.z[a.a.tagName.toUpperCase()] || l.z["*"];
      a.a.addEventListener(b, d, o);
	  Array.from(a.properties.menuItems).forEach(function(mi) {
			if(_c)return;
			
			if(mi.classList.contains("select"))_c = mi;
		})
    }
  };
  Object.inherit(l, i);
  l.w = "data-menu-event";
  l.N = "data-menu-detail";
  l.O = "data-trigger-event";
  l.z = {"*":"click", FORM:"submit"};
  l.prototype.f = "onlifeschema.org/WAMenu";
  var q = e.WATabs = function(b) {
    var a = this;
    q.superclass.constructor.apply(a, arguments);
    a.d = m;
    a.r = 0;
    a.c = -1;
    var d = a.init;
    a.init = function() {
      if(d.apply(a, arguments) === o) {
        return o
      }
      a.I(a.a);
      a.d = Array.from(a.a.q.tab);
      a.r = a.d.length;
      a.d.forEach(function(b, d) {
        b.classList.contains("select") && (a.c = d);
        b.addEventListener(e.b.h, function() {
          if(a.c != d) {
            a.a.l = d
          }
          this.classList.add("select")
        });
        b.addEventListener(e.b.g, function(a) {
          this.classList.remove("select");
          a.stopPropagation()
        })
      });
      a.a.addEventListener("tabchange", function(b) {
        var d = a.d[b.prevTab], k = a.d[b.currentTab];
        d && d.dispatchEvent(new CustomEvent(e.b.g, {bubbles:o, cancelable:g}));
        k && k.dispatchEvent(new CustomEvent(e.b.h, {bubbles:g, cancelable:g}));
        b.stopPropagation()
      });
      a.a.addEventListener(e.b.D, function(b) {
        var d = parseInt(b.detail);
        !isNaN(d) && a.a.l != d && (a.a.l = d);
        b.stopPropagation()
      });
      a.a.l = a.c
    }
  };
  Object.inherit(q, i);
  q.prototype.f = "onlifeschema.org/WATabs";
  q.prototype.P = function(b) {
    var a = this.c, d = new CustomEvent("tabchange", {bubbles:g, cancelable:g});
    b >= this.d.length ? b = this.d.length - 1 : 0 > b && (b = 0);
    this.c = d.currentTab = b;
    d.prevTab = a;
    this.a.dispatchEvent(d)
  };
  q.prototype.I = function(b) {
    var a = this;
    Object.defineProperties(b, {currentTab:{get:function() {
      return a.c
    }, set:function(b) {
      isNaN(b = parseInt(b)) || a.P(b);
      return a.c
    }}, tabCount:{get:function() {
      return a.r
    }}});
    b.getcurrentTab && b.addBehavior && b.addBehavior("class.ui.WATabs.ielt8.htc")
  };
  q.addEvent = i.addEvent;
  q.removeEvent = i.removeEvent;
  var B = "scr" + u(5), x = Function.prototype.call.bind(Array.prototype.forEach), r = e.WebApplication = function(b, a) {
    var d = this;
    r.superclass.constructor.apply(d, arguments);
    d.fa = m;
    d.ca = {status:{ja:o}};
    var c = d.init;
    d.init = function() {
      if(c.apply(d, arguments) === o) {
        return o
      }
      var a = b.getAttribute("itemid");
      if("urn" === (a || "").split(":")[0] && !d.Q) {
        return j.ResourceManager.i(a, function(c, e) {
          function i(a, b) {
            "object" == typeof c && (new c.application(a)).init(b)
          }
          function l(a, b) {
            var d = document.createDocumentFragment(), c = d.appendChild(document.createElement("div"));
            c.innerHTML = a;
            c = c.firstChild;
            for(x(c.attributes, function(a) {
              "class" == a.name && x(c.classList, function(a) {
                b.classList.add(a)
              });
              b.setAttribute(a.name, a.value)
            });d = c.childNodes[0];) {
              3 == d.nodeType ? c.removeChild(d) : b.appendChild(d)
            }
            c.innerHTML = "";
            d = c = m
          }
          d.L(c, e);
          y(b) ? "object" == typeof c ? c.html ? j.ResourceManager.M(a + "/" + c.html, function(e) {
            "" == e ? console.error("Empty answer for '" + a + "' request") : (l(e, b), i(c, b), d.init())
          }, function() {
            console.error("Some error fired while sending '" + a + "' request")
          }) : console.error("Need `html` teamplete in 'html' property") : (l(c, b), i(c, b), d.init()) : (i(c, b)/*, d.init()*/)
        }), d.Q = g, o
      }
    }
  };
  Object.inherit(r, i);
  r.prototype.f = "onlifeschema.org/WebApplication";
  r.prototype.p = function(b, a) {
    return"/" == b.charAt(0) ? b : /^http(s?)\:\/\//ig.test(b) ? b : a + "/" + b
  };
  r.prototype.L = function(b, a) {
    var d = this, c, f, e;
    if("object" != typeof b) {
      try {
        c = JSON.parse(b)
      }catch(i) {
        console.error("Can't parse JSON | error message: " + i.message);
        return
      }
    }else {
      c = b
    }
    e = c.id;
    (f = c.css) && f.forEach(function(b) {
      j.ResourceManager.u(d.p(b, a), m)
    });
    (f = c.js) && f.forEach(function(b, c) {
      j.ResourceManager.t(d.p(b, a), m, "script_" + e + "_" + c)
    });
    c.app && j.ResourceManager.t(d.p(c.da, a), function() {
      var a = j.exports;
      a ? (Object.append(c, a), delete j.exports, j.exports = m) : console.info("Application '" + e + "' has no exported functions");
      onDone && onDone(c)
    }, e ? B + e : 0)
  };
  j.MicroformatConstructors = {"onlifeschema.org/WebApplication":e.WebApplication, "onlifeschema.org/WAElement":e.WAElement, "onlifeschema.org/WATabs":e.WATabs, "onlifeschema.org/WAMenu":e.WAMenu, "onlifeschema.org/WAForm":e.WAForm, "schema.org/ImageGallery":e.ImageGallery}
})(window);
