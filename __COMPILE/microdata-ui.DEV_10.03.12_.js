(function(j) {
  var IS_DEBUG = !0, DEBUG = !0;
  var i = j.MicroformatError = function(b) {
    var a = this === j ? new i.F : this;
    i.superclass.constructor.apply(a, arguments);
    a.name = "MicroformatError";
    a.message = b || "";
    return a
  };
  Object.inherit(i, Error);
  i.F = function() {
  };
  var d = j.ui = j.ui || {}, q = function(b) {
    var a = !b.firstChild, c = 0;
    if(!a) {
      for(a = !0;(el = b.childNodes[c++]) && a;) {
        a = 3 === el.nodeType && "" === el.nodeValue.trim()
      }
    }
    return a
  }, m = Function.prototype.call.bind(Array.prototype.forEach), k = d.WAElement = function(b, a) {
    j.DEBUG && (b == void 0 ? console.error("[ui.WAElement] new:: \u042d\u043b\u0435\u043c\u0435\u043d\u0442 \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0437\u0430\u0434\u0430\u043d") : "object" != typeof b && console.error("[ui.WAElement] new:: \u042d\u043b\u0435\u043c\u0435\u043d\u0442 \u0434\u043e\u043b\u0436\u0435\u043d \u0442\u0438\u043f\u0430 Object"));
    k.formatTest(b);
    var c = this, f = ++k._nextUid;
    c.options = {};
    c.DOMElement = b;
    c.owner = a;
    c.isInit = !1;
    c.uid = function() {
      return f
    };
    c.init = function() {
      if(c.isInit) {
        return!1
      }
      var a = c.DOMElement, b = a.getAttribute("itemid");
      
	  var _bo = b && "urn:onlife:apps" === b.substr(0, 15) && !c.templateLoaded;
	  
	  if(_bo){(ResourceManager.loadResource(b, function(e) {
        function f(a, b) {
          "object" == typeof e && (new e.constructor(a)).init(b)
        }
        function p(a, e) {
          var b = document.createDocumentFragment(), c = b.appendChild(document.createElement("div"));
          c.innerHTML = a;
          c = c.firstChild;
		  
          m(c.attributes, function(a) {
            "class" == a.name && m(c.classList, function(a) {
              e.classList.add(a)
            });
            e.setAttribute(a.name, a.value)
          });
		  var ch;
		  while(ch = c.childNodes[0]) {
		    if(ch.nodeType == 3)c.removeChild(ch);
			else e.appendChild(ch);
		  }
          c.innerHTML = "";
          b = c = null
        }
        if(q(a)){
		"object" == typeof e ? ResourceManager.loadTextResource(b + "/" + e.html, function(e1) {
          "" == e1 ? console.error("Empty answer for '" + b + "' request") : (p(e1, a), f(e, a), c.init()
		  )
        }, function() {
          console.error("Some error fired while sending '" + b + "' request")
        }) : (p(e, a), f(a), c.init()) 
		
		}
		else {f(e, a), c.init()}
      }), c.templateLoaded = !0);return false;}
      c.id = a.id || (a.id = randomString(9) + "_");
      c.properties = a.properties;
      c.components = Array.from(c.properties.component);
      m(c.components, function(a) {
        var b = a.getAttribute("itemtype");
        if(null === b) {
          throw new i("itemscope attribute need");
        }
        b.split(" ").forEach(function(b) {
          var f = MicroformatConstructors[b];
          f ? (new f(a, c)).init() : console.error("unkonown component type : " + b)
        })
      });
      a.addEventListener(d.EventTypes.ON_SHOW, function() {
        var e = a.getAttribute("style");
        e && (e = e.replace(": ", ":").replace(" :", ":").replace("display:none", ""), a.setAttribute("style", e));
        this.classList.add("select")
      });
      a.addEventListener(d.EventTypes.ON_HIDE, function(e) {
        this.classList.remove("select")
		  e.stopPropagation();
      });
      a.__uielement__ = c;
      return c.isInit = !0
    }
  };
  k.formatTest = function(b) {
    if(null === b.getAttribute("itemscope")) {
      throw i("itemscope attribute need");
    }
    var a = b.getAttribute("itemtype");
    if(null === a) {
      throw i("itemscope attribute need");
    }
    if(!b.microdataType && ~a.indexOf(b.microdataType)) {
      throw i("element must implement '" + b.microdataType + "' microdata type except of '" + a + "'");
    }
  };
  k._nextUid = 0;
  k.prototype.microdataType = "onlifeschema.org/WAElement";
  k.prototype.show = function() {
    this.DOMElement.dispatchEvent(new CustomEvent("show", {bubbles:!1}))
  };
  k.prototype.hide = function() {
    this.DOMElement.dispatchEvent(new CustomEvent("hide", {bubbles:!1}))
  };
  var e11 = d.WAForm = function(b, j) {
    function h(a) {
      var c = a.target;
      "FORM" != c.tagName.toUpperCase() && (c = c.form);
      if(!c) {
        return a.stopPropagation(), a.preventDefault(), !1
      }
      var b = c.action;
      if(b) {
        var d = b.split("?")[1];
        if(d) {
          d = d.replace(/\{\[(.*?)\]\}/gi, function(a, b) {
            return c[b] ? c[b].value : ""
          })
        }else {
          for(var e = -1, f;f = c[++e];) {
            d += (0 == e ? "" : "&") + f.name + "=" + f.value
          }
        }
        j.DEBUG && console.log(b + "?" + d)
      }
      a.preventDefault();
      return!1
    }
    var a = this;
    e11.superclass.constructor.apply(a, arguments);
    var i = a.init;
    a.init = function() {
      if(!i.apply(a, arguments)) {
        return!1
      }
      a.DOMElement.addEventListener("submit", h, !1)
    }
  };
  Object.inherit(e11, d.WAElement);
  e11.prototype.microdataType = "onlifeschema.org/WAForm";
  var n = d.ImageGallery = function(b) {
    var a = this;
    n.superclass.constructor.apply(a, arguments);
    a.imageCount = 0;
    a.currentImage = -1;
    var c = a.init;
    a.init = function() {
      if(!1 === c.apply(a, arguments)) {
        return!1
      }
      a.openImage = a.properties.primaryImageOfPage[0];
      a.images = a.properties.associatedMedia;
      a.imageCount = a.images.length;
      a.DOMElement.addEventListener("showimage", function(b) {
        var c = a.images[a.currentImage], d = b.detail;
        c && c.classList.remove("select");
        d && (d.classList.add("select"), a.currentImage = Array.from(a.images).indexOf(d));
        0 > a.currentImage || !d ? (a.currentImage = 0, d = Array.from(a.images)[0]) : a.currentImage >= a.imageCount && (a.currentImage = a.imageCount - 1, d = Array.from(a.images)[a.currentImage]);
        a.openImage.properties.contentURL[0].itemValue = d.properties.contentURL[0].itemValue;
        a.openImage.properties.caption[0].itemValue = d.properties.caption[0].itemValue;
        a.openImage.properties.description[0].itemValue = d.properties.description[0].itemValue;
        b.stopPropagation()
      });
      Array.from(a.images).forEach(function(b) {
        b.addEventListener("click", a.previewOnClick, !1);
        b.addEventListener("touchstart", a.previewOnClick, !1);
        b.addEventListener("touchend", a.previewOnClick, !1);
        b.classList.contains("select") && b.dispatchEvent(new Event("click"))
      })
    }
  };
  Object.inherit(n, d.WAElement);
  n.prototype.microdataType = "schema.org/ImageGallery";
  n.prototype.previewOnClick = function() {
    this.dispatchEvent(new CustomEvent("showimage", {bubbles:!0, cancelable:!0, detail:this}))
  };
  var h = d.WAMenu = function(b) {
    var a = this;
    h.superclass.constructor.apply(a, arguments);
    var c = bubbleEventListener(h.menuEventDetailAttribute, function(b, c, e) {
      b = new CustomEvent(a.menuEvent, {bubbles:!0, cancelable:!0, detail:e});
      a.DOMElement.dispatchEvent(b)
    });
    a.menuEvent = a.DOMElement.getAttribute(h.menuEventAttribute);
    var d = a.init;
    a.init = function() {
      if(!1 === d.apply(a, arguments)) {
        return!1
      }
      !a.menuEvent && j.DEBUG && console.error("WAMenu element must have value in '" + h.menuEventAttribute + "' attribute");
      a.DOMElement.addEventListener("click", c, !1);
      a.menuItems = a.properties.menuItem
    }
  };
  Object.inherit(h, d.WAElement);
  h.menuEventAttribute = "data-menu-event";
  h.menuEventDetailAttribute = "data-menu-detail";
  h.prototype.microdataType = "onlifeschema.org/WAMenu";
  var l = d.WATabs = function(b) {
    var a = this;
    l.superclass.constructor.apply(a, arguments);
    a._subTabs = null;
    a._tabsCount = 0;
    a._currentTab = -1;
    var c = a.init;
    a.init = function() {
      if(!1 === c.apply(a, arguments)) {
        return!1
      }
      a.initTabsSpetialProperties(a.DOMElement);
      a._subTabs = Array.from(a.properties.tab);
      a._tabsCount = a._subTabs.length;
      a._subTabs.forEach(function(b, c) {
        b.classList.contains("select") && (a._currentTab = c);
        b.addEventListener(d.EventTypes.ON_SHOW, function() {
          a._currentTab != c && (a.DOMElement.currentTab = c);
          this.classList.add("select")
        });
        b.addEventListener(d.EventTypes.ON_HIDE, function(e) {
          this.classList.remove("select")
		  e.stopPropagation();
        })
      });
      a.DOMElement.addEventListener("tabchange", function(b) {
        var c = a._subTabs[b.prevTab], i = a._subTabs[b.currentTab];
        c && c.dispatchEvent(new CustomEvent(d.EventTypes.ON_HIDE, {bubbles:!1, cancelable:!0}));
        i && i.dispatchEvent(new CustomEvent(d.EventTypes.ON_SHOW, {bubbles:!1, cancelable:!0}));
        b.stopPropagation()
      });
      a.DOMElement.addEventListener(d.EventTypes.ON_CURRENT_CHILD_CHANGE, function(b) {
        var c = parseInt(b.detail);
        !isNaN(c) && a.DOMElement.currentTab != c && (a.DOMElement.currentTab = c);
        b.stopPropagation()
      });
      a.DOMElement.currentTab = a._currentTab
    }
  };
  Object.inherit(l, d.WAElement);
  l.prototype.microdataType = "onlifeschema.org/WATabs";
  l.prototype.showTab = function(b) {
    var a = this._currentTab, c = new CustomEvent("tabchange", {bubbles:!0, cancelable:!0});
    b >= this._subTabs.length ? b = this._subTabs.length - 1 : 0 > b && (b = 0);
    this._currentTab = c.currentTab = b;
    c.prevTab = a;
    this.DOMElement.dispatchEvent(c)
  };
  l.prototype.initTabsSpetialProperties = function(b) {
    var a = this;
    Object.defineProperties(b, {currentTab:{get:function() {
      return a._currentTab
    }, set:function(b) {
      isNaN(b = parseInt(b)) || a.showTab(b);
      return a._currentTab
    }}, tabCount:{get:function() {
      return a._tabsCount
    }}});
    b.getcurrentTab && b.addBehavior && b.addBehavior("class.ui.WATabs.ielt8.htc")
  };
  var o = d.WebApplication = function(b) {
    var a = this;
    o.superclass.constructor.apply(a, arguments);
    a.authForm = null;
    a.account = {status:{login:!1}};
    var c = a.init;
    a.init = function() {
      if(!1 === c.apply(a, arguments)) {
        return!1
      }
    }
  };
  Object.inherit(o, d.WAElement);
  o.prototype.microdataType = "onlifeschema.org/WebApplication";
  o.prototype.showAuthForm = function() {
    this.authForm && this.authForm.dispatchEvent(new CustomEvent("show", {bubbles:!0, cancelable:!0}))
  };
  d.EventTypes = {ON_SHOW:0, ON_HIDE:1, ON_POPUP_ON:10, ON_POPUP_OFF:11, ON_EDIT_START:20, ON_EDIT_END:21, ON_EDIT_APPLY:22, ON_EDIT_CANCEL:23, ON_PART_SHOW:30, ON_PART_HIDE:31, ON_CURRENT_CHILD_CHANGE:32, ON_REGISTER_EVENT_CALLBACK:40, ON_ERROR:100};
  j.MicroformatConstructors = {"onlifeschema.org/WebApplication":d.WebApplication, "onlifeschema.org/WAElement":d.WAElement, "onlifeschema.org/WATabs":d.WATabs, "onlifeschema.org/WAMenu":d.WAMenu, "onlifeschema.org/WAForm":d.WAForm, "schema.org/ImageGallery":d.ImageGallery};
  (function(b, a) {
    b.ResourceManager || (b.ResourceManager = new function() {
      function c(a, b) {
        return"/" == a.charAt(0) ? a : /^http(s?)\:\/\//ig.test(a) ? a : b + "/" + a
      }
      function d(a, b) {
        var c;
        (c = b ? document.getElementById(b) : 0) && c.parentNode.removeChild(c);
        document.head.appendChild(c = document.createElement(a)).id = b;
		return c;
      }
      var g = this, i = "scr" + randomString(5);
      g.applications = {};
      g.createScript = function(a, b, c) {
        c = d("script", c);
        c.onload = b;
        c.src = a
      };
      g.createStyle = function(a, b) {
        var c = d("link", b);
        c.setAttribute("rel", "stylesheet");
        c.setAttribute("href", a)
      };
      g.loadResource = function(a, b, c) {
		"urn:onlife:" === a.substr(0, 11) ? "templates" === a.substr(11, 9) ? b("") : "apps" === a.substr(11, 4) && g.loadApplication(a, b, c) : b("")
      };
      g.loadTemplate = function(b, c, d) {
        "urn:onlife:" === b.substr(0, 11) && (b = b.substr(11), b = b.replace(/\:/g, "/"));
        console.erorr("This function must never fired!!!")
      };
      g.loadApplication = function(e, d, f) {
		"urn:onlife:" === e.substr(0, 11) && (e = e.substr(11), e = e.replace(/\:/g, "/"));
        g.applications[e] ? d(g.applications[e]) : a(e + "/index.json", function(a) {
          var f, h;
          try {
            f = JSON.parse(a)
          }catch(j) {
            return console.error("Can't parse JSON | error message: " + j.message), !1
          }
          h = f.id;
          (a = f.css) && a.forEach(function(a, b) {
            g.createStyle(c(a, e), null, "style_" + h + "_" + b)
          });
          (a = f.js) && a.forEach(function(a, b) {
            g.createScript(c(a, e), null, "script_" + h + "_" + b)
          });
          f.app && g.createScript(c(f.app, e), function() {
            var a = b.exports;
            a ? (Object.append(f, a), g.applications[e] = f, delete b.exports, b.exports = null) : console.info("Application '" + h + "' has no exported functions");
            d && d(f)
          }, h ? i + h : 0)
        }, f)
      };
      g.loadTextResource = function(b, c, d) {
        "urn:onlife:" === b.substr(0, 11) && (b = b.substr(11), b = b.replace(/\:/g, "/"));
        a(b, c, d)
      }
    })
  })(window, function(b, a, c, d) {
    void 0 == d && (d = false);
    var g;
    d && (g = b.split("?")[1], b = b.split("?")[0]);
    SendRequest(b, g || "", function(b) {
      a(b.responseText)
    }, c, {post:d})
  })
})(window);
