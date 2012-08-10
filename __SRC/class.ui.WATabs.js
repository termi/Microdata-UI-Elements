// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name class.uiWAElement.js
// @check_types
// ==/ClosureCompiler==
/*
 * @requared ui.WAElement
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
var ui = global["ui"] = global["ui"] || {};

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WATabs
 * Слушает события: tabchange, menuopentab, show, hide
 * Создаёт события: tabchange
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var WATabs = ui["WATabs"] = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WATabs["superclass"].constructor.apply(thisObj, arguments);

/* PROTECTED */
	/** Подтабы. Список Node's @type {Array.<Node>} */
	thisObj._subTabs = null;

	/** Кол-во под-табов @type {number} */
	thisObj._tabsCount = 0;
	
	/** Текущий выбранный под-таб @type {number} */
	thisObj._currentTab = -1;	
	
/* PUBLIC */
	
/* PUBLIC | FUNCTIONS */
	

/* INIT */
	/** Ссылка на метод init родительского класса
	 * @private
	 * @type {Function}	 */
	var superInit = thisObj["init"];//Сохраняем ссылку
	/**
	 * Инициализация
	 */
	thisObj["init"] = function() {
		//Вызываем метод родительского класса
		if(superInit.apply(thisObj, arguments) === false)return false;
		
		var tmp;

		//Инициализируем специальные свойства контейнера табов
		thisObj.initTabsSpetialProperties(thisObj.DOMElement);
		
		//Получим ссылку на контейнер табов
		thisObj._subTabs = Array["from"](thisObj.DOMElement["properties"]["tab"]);
		thisObj._tabsCount = thisObj._subTabs.length;
			
		thisObj._subTabs.forEach(function(tabEl, _currentIndex){
			/*if(!tabEl.itemType || !~tabEl.itemType.indexOf("onlifeschema.org/WATab")) {
				throw new Error("Таб должен быть типа onlifeschema.org/WATab")
			}*/
			
			//Ищем признак выбранности таба
			if(tabEl.classList.contains("select"))thisObj._currentTab = _currentIndex;				
			
			//Подпишемся на события
			tabEl.addEventListener(ui.EventTypes.ON_SHOW, function(event) {
				//Проверим, что данная вкладка еще не открыта, и только если она не открыта, 
				if(thisObj._currentTab != _currentIndex)
					thisObj.DOMElement["currentTab"] = _currentIndex;
					
				this.classList.add("select");
				//return false;
			})
			tabEl.addEventListener(ui.EventTypes.ON_HIDE, function(event) {
				this.classList.remove("select");
				event.stopPropagation();
				//return false;
			})
		});
		
		//Подпишемся на события::
		//Сообщения об изменеии thisObj.DOMElement.currentTab
		thisObj.DOMElement.addEventListener("tabchange", function(event) {
			var prevTab = thisObj._subTabs[event["prevTab"]],
				newTab = thisObj._subTabs[event["currentTab"]];
			
			//console.log("event 'tabchange' fired. oldTabIndex = '" + event["prevTab"] + "', newTabIndex = '" + event["currentTab"] + "'")
			
			if(prevTab)prevTab.dispatchEvent(new CustomEvent(ui.EventTypes.ON_HIDE, {bubbles : false, cancelable : true}));
			if(newTab)newTab.dispatchEvent(new CustomEvent(ui.EventTypes.ON_SHOW, {bubbles : true, cancelable : true}));
			
			//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
			event.stopPropagation();
		})
		
		//Меню для таб-контейнера
		thisObj.DOMElement.addEventListener(ui.EventTypes.ON_CURRENT_CHILD_CHANGE, function(event) {
			var newTabIndex = parseInt(event.detail);
			if(!isNaN(newTabIndex) && thisObj.DOMElement["currentTab"] != newTabIndex) {
				thisObj.DOMElement["currentTab"] = newTabIndex;
			}
			//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
			event.stopPropagation();
		});
		
		//Покажем выбранный таб
		thisObj.DOMElement["currentTab"] = thisObj._currentTab;
	}
}
Object["inherit"](WATabs, ui["WAElement"]);

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WATabs.prototype.microdataType = "onlifeschema.org/WATabs";

/**
 * Покажем определённую вкладку
 * @type {Function}
 */
WATabs.prototype.showTab = function(newValue) {
	var thisObj = this,
		oldValue = thisObj._currentTab,
		ev = new CustomEvent("tabchange", {bubbles : true, cancelable : true});
	if(newValue >= thisObj._subTabs.length) {
		//console.error("new tab index value too must newValue = '" + newValue + "'. Max: '" + (thisObj._subTabs.length - 1) + "'");
		newValue = thisObj._subTabs.length - 1;
	}
	else if(newValue < 0) {
		newValue = 0;
	}
	
	thisObj._currentTab = ev["currentTab"] = newValue;
	ev["prevTab"] = oldValue;
	
	thisObj.DOMElement.dispatchEvent(ev)
}

/**
 * Инициализирует специальные свойства элемента
 * @param {Node} _element DOMElement
 */
WATabs.prototype.initTabsSpetialProperties = function(_element) {
	// IE < 8 support in class.ui.WATab.htc
	var thisObj = this;

	Object.defineProperties(_element, {
		"currentTab" : {
			"get" : function() {
				return thisObj._currentTab;
			},
			"set" : function(newValue) {
				if(!isNaN(newValue = parseInt(newValue))) {
					thisObj.showTab(newValue);//thisObj._currentTab set here
				}
				return thisObj._currentTab;
			}
		},
		"tabCount" : {
			"get" : function() {
				return thisObj._tabsCount;
			}
		}
	});

	//IE < 8
	if(_element["getcurrentTab"] && _element["addBehavior"]) {
		_element["addBehavior"]("class.ui.WATabs.ielt8.htc");
	}
}

/* STATIC */
WATabs["addEvent"] = ui["WAElement"]["addEvent"];
WATabs["removeEvent"] = ui["WAElement"]["removeEvent"];

/* LOGIC */
if(DEBUG)WATabs["addEvent"](ui.EventTypes.ON_SHOW, console.log.bind(null, "waTabs ONSHOW"));
if(DEBUG)WATabs["addEvent"](ui.EventTypes.ON_HIDE, console.log.bind(null, "waTabs ONHIDE"));

})(window);