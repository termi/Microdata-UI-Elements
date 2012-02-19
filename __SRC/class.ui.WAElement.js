// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name class.uiWAElement.js
// @check_types
// ==/ClosureCompiler==
/*
 * @requared MicroformatError
 * @requared MicroformatConstructors
 * @requared ui.EventTypes (enum.ui.EventTypes.js)
 */

//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = true;
//GCC DEFINES END
 
;(function(global) {//closure

"use strict";

var _urnPrefix = "urn:onlife:",
	_urnPrefix_length = _urnPrefix.length,
	/** @type {string} @const */
	__SCRIPT_ID_PREFIX__ = "scr" + randomString(5),
	/** @type {string} @const */
	__DEFAULT_APPLICATION_FILE__ = "index.json";

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

var ui = global.ui = global.ui || {},
	_isEmptyElement = function(element) {
		var isEmpty = !element.firstChild, i = 0;
		
		if(!isEmpty) {
			isEmpty = true;
			
			while((el = element.childNodes[i++]) && isEmpty)
				isEmpty = el.nodeType === 3 && el.nodeValue.trim() === "";
		}
		
		return isEmpty;
	},
	_forEach = Function.prototype.call.bind(Array.prototype.forEach),
	_hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty),
	/** 
	 * @type {string} eventListners prefix
	 * @const
	 */
	_eventListnersPrfx = "@";

/**
 * Класс, общий для всех UI-объектов
 * @constructor
 * @param {Node} _element DOM-Элемент, который будет ассоциироватся с данным объектом
 * @param {ui.WAElement|ui.WebApplication} _owner Владелей этого компонента
 */
var WAElement = ui["WAElement"] = function(_element, _owner) {
	if(DEBUG) {
		if(_element == void 0)console.error("[ui.WAElement] new:: Элемент должен быть задан")
		else if(typeof _element != "object")console.error("[ui.WAElement] new:: Элемент должен типа Object")
	}
	
	WAElement.formatTest(_element);
	
/* PRIVATE */
	var thisObj = this,
		/** Уникальный идентификатор
		 * @type {number} */
		_uid = ++WAElement._nextUid;

/* OPTIONS */
	/** Объявление объекта для опций
	 * @type {Object} */
	thisObj.settings = {};
	
/* PROTECTED */

/* PUBLIC */
	/** @const
	 * @type {Node} */
	thisObj.DOMElement = _element;
	
	/** Components of this component
	 * @type {Array.<Node>} */
	thisObj.components;
	
	/**
	 * @type {Node} */
	thisObj.owner = _owner;
	
	/** @type boolean */
	thisObj.isInit = false;
/* PUBLICK | FUNCTIONS */
	
/* PUBLICK | PROPERTYS */ //Property - это функции одновременно являющиеся getter'ами и setter'ами
	
	/** Уникальный идентификатор
	 * Property [Read Only]
	 * @return {number} */
	thisObj.uid = function() {
		return _uid;
	}
	
/* INIT */
	/** Функция инициализирует блок
	 */
	thisObj.init = function() {
		if(thisObj.isInit)return false;
		
		var _element = thisObj.DOMElement;
		
		/*\ TODO:: Переделать START \*/
		//Пробуем получить уникальный идентификатор ресурса
		var urn = _element.getAttribute("itemid");
		if(urn && (urn.substr(0, _urnPrefix_length) === _urnPrefix) && !thisObj.templateLoaded) {//Проверим на наличие и, что это уникальный идентификатор ресурса
			
			ResourceManager.loadResource(urn, function(jsonOrText) {
			
				function step2(container, _element) {
					//Инициализируем, если надо приложение
					if(typeof jsonOrText == "object") {
						var constructor = jsonOrText["constructor"],
							application = new constructor(container);
						application.init(_element);
					}
				}
				
				function createNodeFromText(text, container) {
					var df = document.createDocumentFragment(),
						el = df.appendChild(document.createElement("div"));
					el.innerHTML = text;
					el = el.firstChild;
					
					_forEach(el.attributes, function(attr) {
						if(attr.name == "class") {
							_forEach(el.classList, function(className) {
								container.classList.add(className);
							})
						}
						container.setAttribute(attr.name, attr.value);
					})
					
					_forEach(el.childNodes, function(child) {
						container.appendChild(child);
					});
					
					//Вычищаем
					el.innerHTML = "";
					df = el = null;
				}
				
				//Проверим не пустой ли у нас элемент
				if(_isEmptyElement(_element)) {
					if(typeof jsonOrText == "object") {
						ResourceManager.loadTextResource(urn + "/" + jsonOrText["html"], function(text) {
							if(text == "") {
								console.error("Empty answer for '" + urn + "' request");
							}
							else {
								createNodeFromText(text, _element);
								step2(_element);
								
								//Заново запускаем инициализацию
								thisObj.init();
							}
						}, function() {
							console.error("Some error fired while sending '" + urn + "' request");
						})
					}
					else {
						createNodeFromText(jsonOrText, _element);
						step2(_element);
						
						//Заново запускаем инициализацию
						thisObj.init();
					}
				}
				else {
					step2(jsonOrText, _element);
					//Заново запускаем инициализацию
					//thisObj.init();
				}
				
			});
			
			//Поднимаем флаг, что мы уже загружали шаблон или приложение
			thisObj.templateLoaded = true;
				
		}
		/*\ Переделать END \*/
		
		
		//Первоначальная инициализация
		
		//_element.setAttribute("data-element-is-init", "true");//for tests
		//if(!window.asdf)window.asdf = [];window.asdf.push(this);//for tests
					
		//Если у элемента есть id - назначаем его, нету - рандомная строка
		thisObj.id = _element.id || (_element.id = randomString(9) + "_");
				
		//Пройдёмся по всем под-компонентам и инициализируем их
		thisObj.initComponents(thisObj.DOMElement);
		
		//Подпишемся на события
		// add quickly events to the node
		for (var key in this.events) {
			// add the listener ... 
			// NOTE: nothing to bind, no duplicated entries either
			_element.addEventListener(key, this, false);
		}
		
		//Alias
		thisObj.properties = thisObj.DOMElement.properties;

		if(DEBUG)_element.__uielement__ = thisObj;
		
		return thisObj.isInit = true;
	}
}
/* STATIC */

/**
 * Проверка на соответствие формату микродаты
 * @type {ui.WAElement}
 */
WAElement.formatTest = function(_waElement) {
	if(_waElement.getAttribute("itemscope") === null)
		throw MicroformatError("itemscope attribute need");
		
	var _itemtype = _waElement.getAttribute("itemtype");
	if(_itemtype === null)
		throw MicroformatError("itemscope attribute need");
	
	if(!_waElement.microdataType)
	
	if(~_itemtype.indexOf(_waElement.microdataType))
		throw MicroformatError("element must implement '" + _waElement.microdataType + "' microdata type except of '" + _itemtype + "'");
		
	//TODO:: inherit test
	//
}

WAElement._nextUid = 0;
/* PROTOTYPE */
/* handleEvent START*/
// Idea from http://webreflection.blogspot.com/2012/01/introducing-objecthandler.html & http://ajaxian.com/archives/an-alternative-way-to-addeventlistener
WAElement.prototype.handleEvent = function(e) {
	var evntListnerName = e.type,
		_notPpreventCapture = true;
	while((evntListnerName = _eventListnersPrfx + evntListnerName) in this) {
		(this[evntListnerName] || []).forEach(function(callback, i, stack) {
			if(_notPpreventCapture) {
				_notPpreventCapture = callback.call(
					this,
					e,
					callback,
					this
				)
			}
		}, this);
	}
}
WAElement.prototype.addEvent = function(_eventName, _handle) {
	_eventName = _eventListnersPrfx + _eventName;
	if(_hasOwnProperty(this, _eventName))this[_eventName].push(_handle);
	else if(_eventName in this)this[_eventListnersPrfx + _eventName] = [_handle];
	else this[_eventName] = [_handle];
}
WAElement.prototype.removeEvent = function(_eventName) {
	//TODO::
}
/* handleEvent END*/
WAElement.prototype.addEvent.call(WAElement.prototype, ui.EventTypes.ON_SHOW, function(event) {
	//Если компонент был скрыт с помощью style - уберём скрытие
	var thisObj = this,
		style = thisObj.DOMElement.getAttribute("style");
	if(style) {
		style = style.replace(": ", ":").replace(" :", ":").replace("display:none", "");
		thisObj.DOMElement.setAttribute("style", style);
	}
	
	thisObj.DOMElement.classList.add("select");
})
WAElement.prototype.addEvent.call(WAElement.prototype, ui.EventTypes.ON_HIDE, function(event) {
	this.DOMElement.classList.remove("select");
	event.stopPropagation();//Stop `hide` event propagation
})



/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAElement.prototype.microdataType = "onlifeschema.org/WAElement";
/**
 * Показать элемент.
 * @this {ui.WAElement}
 */
WAElement.prototype.show = function() {
	this.DOMElement.dispatchEvent(new CustomEvent(ui.EventTypes.ON_SHOW, {bubbles : false}));
}
/**
 * Скрыть элемент.
 * @this {ui.WAElement}
 */
WAElement.prototype.hide = function() {
	this.DOMElement.dispatchEvent(new CustomEvent(ui.EventTypes.ON_HIDE, {bubbles : false}));
}
/**
 * Components init
 * @this {Node} node DOM Element with properties["component"]
 */
WAElement.prototype.initComponents = function __initComponents(node) {
	var _components = node.properties["component"],
		thisObj = this;
	
	if(!_components || _components.length === 0)return;
	
	var i = -1,
		component,
		_itemType;
	while(component = _components[++i]) {
		if(!component.hasAttribute("itemscope"))continue;
		
		_itemType = component.getAttribute("itemtype");
		
		//TODO:: Create multitype support then it approve in Spec
		//_itemType.split(" ").forEach(function(type) { })
			var constructor = MicroformatConstructors[_itemType];
			if(!constructor) {
				console.info("unkonown component type : " + _itemType);
				__initComponents.call(thisObj, component);
			}
			else {
				var newComponentBehavior = new constructor(component, thisObj);
				//TODO:: Отложить init и вызывать его только тогда, когда он действительно необходим
				newComponentBehavior.init();
			}
		
	}
}


})(window);