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

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

// IMPORT
var ui = global["ui"] = global["ui"] || {},
	randomString = function() {
		return "_" + Math.random();
	};

var _hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty),

	/** @type {string} eventListners prefix
	 * @const */
	__eventListnersPrfx__ = "@",

	_isEmptyElement = function(element) {//temporary
		var isEmpty = !element.firstChild, i = 0, el;
		
		if(!isEmpty) {
			isEmpty = true;
			
			while((el = element.childNodes[i++]) && isEmpty)
				isEmpty = el.nodeType === 3 && el.nodeValue.trim() === "";
		}
		
		return isEmpty;
	};

/**
 * Класс, общий для всех UI-объектов
 * @constructor
 * @param {Node} _element DOM-Элемент, который будет ассоциироватся с данным объектом
 * @param {ui.WAElement} _owner Владелей этого компонента
 */
var WAElement = ui["WAElement"] = function(_element, _owner) {
	if(DEBUG) {
		if(_element == void 0)console.error("[ui.WAElement] new:: Element in second parameter must be set")
		else if(typeof _element != "object")console.error("[ui.WAElement] new:: Element in second parameter must be Object type")
	}

	var thisObj = this;

	/** Объявление объекта для опций
	 * @type {Object} */
	thisObj.settings = {
		activeClass : "select"
	};
	
/* PROTECTED */
	/** @type {Object} hash of [EventName => Array.<Function>]*/
	thisObj._events = {};

/* PUBLIC */
	/** @const
	 * @type {Node} */
	thisObj.DOMElement = _element;
	
	/** Owned application
	 * @type {ui.WebApplication} */
	thisObj.webApplication = _owner &&
		(_owner instanceof ui["WebApplication"] && _owner || _owner.webApplication) || null;
	
	/** Owner
	 * @type {ui.WAElement} */
	thisObj.owner = _owner;
	
	/* * Components of this component
	 * @type {Array.<Node>} * /
	thisObj.components;*/
	
/* PUBLICK | FUNCTIONS */
	
/* PUBLICK | PROPERTYS */ //Property - это функции одновременно являющиеся getter'ами и setter'ами
	
	/** Уникальный идентификатор
	 * Property [Read Only]
	 * @return {number} */
	thisObj.uid = function() {
		return _uid;
	};
	
/* INIT */
};
/* PROTOTYPE */
var WAElement_prototype = WAElement.prototype;
/* INIT */
/** Функция инициализирует компонент
 */
WAElement_prototype["init"] = function() {
	var thisObj = this;
	
	if(thisObj.isInit)return false;
	
	//Первоначальная инициализация
	var _element = thisObj.DOMElement
		, options = _element.getAttribute("data-wa-data")
	;

	try{options = JSON.parse(options)}catch(__e__){options = void 0}
	if(options)Object["extend"](thisObj.settings, options);

	if(!_element["__uielements__"])_element["__uielements__"] = {};
	_element["__uielements__"][thisObj.microdataType] = thisObj;
	
	//Если у элемента есть id - назначаем его, нету - рандомная строка
	/*thisObj.id = */_element.id || (_element.id = randomString(9) + "_");
	
	//Подпишемся на события
	// add quickly events to the node
	if(!this._prototypeEvents_local) {
		var key;
		this._prototypeEvents_local = this._prototypeEvents.concat();
		while((key = this._prototypeEvents_local.pop()) !== void 0) {
			// add the listener ... 
			// NOTE: nothing to bind, no duplicated entries either
			_element.addEventListener(key, this, false);
		}
	}
	
	//Alias
	thisObj.properties = thisObj.DOMElement["properties"];
	
	//TODO:: Сейчас все виджеты с пустыми элементами будут помечатся как не инициализированные | thisObj.isInit == false
	if(_isEmptyElement(_element))return false;//Предотвращаем дальнейшую инициализацию
	
	//_element.setAttribute("data-element-is-init", "true");//for tests
	//if(!window.asdf)window.asdf = [];window.asdf.push(this);//for tests
			
	//Пройдёмся по всем под-компонентам и инициализируем их
	thisObj.initComponents(thisObj.DOMElement);
	
	/** @type boolean */
	return thisObj.isInit = true;
};
/* handleEvent START*/
// Idea from http://webreflection.blogspot.com/2012/01/introducing-objecthandler.html & http://ajaxian.com/archives/an-alternative-way-to-addeventlistener
WAElement_prototype["handleEvent"] = function(e) {
	/** @param {Array.<Function>} listeners
	 * @param {Object} context this object*/
	function doAllListeners(listeners, context) {
		var _notPpreventCapture;
		listeners.forEach(function(callback, i, stack) {
			if(_notPpreventCapture !== false) {
				_notPpreventCapture = callback.call(
					this,
					e,
					callback,
					this
				)
			}
		}, context)
	}
	
	var thisObj = this,
		evntListnerName = e.type,
		listeners = thisObj._events[evntListnerName];
	
	//Listeners of this object
	if(listeners)doAllListeners(listeners, thisObj);
	
	//Listeners of prototypes
	while((evntListnerName = __eventListnersPrfx__ + evntListnerName) in this) {
		listeners = this[evntListnerName];
		if(listeners)doAllListeners(listeners, thisObj);
	}
};
WAElement_prototype["addEvent"] = function(_eventName, _handle) {
	var thisObj = this,
		listeners = thisObj._events[_eventName];
	if(!listeners) {
		listeners = thisObj._events[_eventName] = [];
		thisObj.DOMElement.addEventListener(_eventName, this, false);
	}
	
	listeners.push(_handle);
};
WAElement_prototype["removeEvent"] = function(_eventName) {
	//TODO::
};
/* handleEvent END*/

/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAElement_prototype.microdataType = "h123.ru/WAElement";
/**
 * Показать элемент.
 * @this {ui.WAElement}
 */
WAElement_prototype["show"] = function() {
	this.DOMElement.dispatchEvent(new CustomEvent(ui.EventTypes.ON_SHOW, {bubbles : false}));
};
/**
 * Скрыть элемент.
 * @this {ui.WAElement}
 */
WAElement_prototype["hide"] = function() {
	this.DOMElement.dispatchEvent(new CustomEvent(ui.EventTypes.ON_HIDE, {bubbles : false}));
};
/**
 * Components init
 * @this {Node} node DOM Element with properties["component"]
 */
WAElement_prototype.initComponents = function __initComponents(node) {
	var _components = node["properties"]["e-component"],
		thisObj = this;
	
	if(!_components || _components.length === 0)return;
	
	var i = -1,
		component,
		_itemType;
	while(component = _components[++i]) {
		if(!component.hasAttribute("itemscope"))continue;
		
		_itemType = component.getAttribute("itemtype");
		
		_itemType.split(/\s+/).forEach(function(type) {
			if(component["__uielements__"] && component["__uielements__"][type])return;//Already done
			
			var _constructor = MicroformatConstructors[type];
			if(!_constructor) {
				if(DEBUG)console.info("unkonown component type : " + type);
				__initComponents.call(thisObj, component);
			}
			else {
				var newComponentBehavior = new _constructor(component, thisObj);
				//TODO:: Отложить init и вызывать его только тогда, когда он действительно необходим
				newComponentBehavior["init"]();
			}
		})
	}
};
WAElement_prototype._prototypeEvents = [];

/* STATIC */
WAElement._nextUid = 0;

WAElement["addEvent"] = function(_event, _handle) {
	var thisObj = this;
	if(!thisObj || thisObj == global)thisObj = WAElement_prototype;
	else thisObj = thisObj.prototype;
	
	if(DEBUG)console.info("Prototype addEvent class : ", thisObj)

	var _eventName = __eventListnersPrfx__ + _event;
	if(_hasOwnProperty(thisObj, _eventName))thisObj[_eventName].push(_handle);
	else {
		while(_eventName in thisObj)_eventName = __eventListnersPrfx__ + _eventName;
	
		if(thisObj[_eventName])thisObj[_eventName].push(_handle);
		else {
			if(!~WAElement_prototype._prototypeEvents.indexOf(_event))
				WAElement_prototype._prototypeEvents.push(_event);
			thisObj[_eventName] = [_handle];
		}
	}
	//TODO:: update all exists instances
};
WAElement["removeEvent"] = function(_eventName, _handle) {
	var thisObj = this;
	if(!thisObj || thisObj == global)thisObj = WAElement_prototype;

	_eventName = __eventListnersPrfx__ + _eventName;
	//TODO::
};

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
	
	//if(!_waElement.microdataType)
	
	if(~_itemtype.split(/\s+/).indexOf(_waElement.microdataType))
		throw MicroformatError("element must implement '" + _waElement.microdataType + "' microdata type except of '" + _itemtype + "'");
		
	//TODO:: inherit test
	//
};

/* LOGIC */
WAElement["addEvent"](ui.EventTypes.ON_SHOW, function(event) {
	if(DEBUG)console.log("SHOW")
	
	//Если компонент был скрыт с помощью style - уберём скрытие
	var thisObj = this,
		style = thisObj.DOMElement.getAttribute("style");
	if(style) {
		style = style.replace(": ", ":").replace(" :", ":").replace("display:none", "");
		thisObj.DOMElement.setAttribute("style", style);
	}
	
	thisObj.DOMElement.classList.add(thisObj.settings.activeClass);
});
WAElement["addEvent"](ui.EventTypes.ON_HIDE, function(event) {
	if(DEBUG)console.log("HIDE")
	
	var thisObj = this;
	
	thisObj.DOMElement.classList.remove(thisObj.settings.activeClass);
	event.stopPropagation();//Stop `hide` event propagation
})


})(window);
