/*
 * @requared ui.WAElement
 */

;(function(global) {//closure

var ui = global.ui;

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
	WATabs.superclass.constructor.apply(thisObj, arguments);
	
/* PUBLIC */
	/** Подтабы. Список Node's @type {Array.<Node>} */
	thisObj.subTabs = null;

	/** Кол-во под-табов @type {number} */
	thisObj.tabsCount = 0;
	
	/** Текущий выбранный под-таб @type {number} */
	thisObj.currentTab = -1;

/* PUBLIC | FUNCTIONS */

/* INIT */
	/** Ссылка на метод init родительского класса
	 * @private
	 * @type {Function}	 */
	var superInit = thisObj.init;//Сохраняем ссылку
	/**
	 * Инициализация
	 */
	thisObj.init = function() {
		//Вызываем метод родительского класса
		if(superInit.apply(thisObj, arguments) === false)return false;
		
		var tmp;

		//Инициализируем специальные свойства контейнера табов
		thisObj.initTabsSpetialProperties(thisObj.DOMElement);
		
		//Получим ссылку на контейнер табов
		thisObj.subTabs = $A(thisObj.properties["tab"]);
		thisObj.tabsCount = thisObj.subTabs.length;
			
		thisObj.subTabs.forEach(function(tabEl, _currentIndex){
			/*if(!tabEl.itemType || !~tabEl.itemType.indexOf("onlifeschema.org/WATab")) {
				throw new Error("Таб должен быть типа onlifeschema.org/WATab")
			}*/
			
			//Ищем признак выбранности таба
			if(tabEl.classList.contains("select"))thisObj.currentTab = _currentIndex;				
			
			//Подпишемся на события
			tabEl.addEventListener("show", function(event) {
				//Проверим, что данная вкладка еще не открыта, и только если она не открыта, 
				if(thisObj.currentTab != _currentIndex)
					thisObj.DOMElement.currentTab = _currentIndex;
					
				this.classList.add("select");
				//return false;
			})
			tabEl.addEventListener("hide", function(event) {
				this.classList.remove("select");
				//return false;
			})
		});
		
		//Подпишемся на события::
		//Сообщения об изменеии thisObj.DOMElement.currentTab
		thisObj.DOMElement.addEventListener("tabchange", function(event) {
			var prevTab = thisObj.subTabs[event["prevTab"]],
				newTab = thisObj.subTabs[event["currentTab"]];
			
			//console.log("event 'tabchange' fired. oldTabIndex = '" + event["prevTab"] + "', newTabIndex = '" + event["currentTab"] + "'")
			
			if(prevTab)prevTab.dispatchEvent(new CustomEvent("hide", {bubbles : false, cancelable : true}));
			if(newTab)newTab.dispatchEvent(new CustomEvent("show", {bubbles : false, cancelable : true}));
			
			//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
			event.stopPropagation();
		})
		
		//Меню для таб-контейнера
		thisObj.DOMElement.addEventListener("menuopentab", function(event) {
			var newTabIndex = parseInt(event.detail);
			if(!isNaN(newTabIndex) && thisObj.DOMElement.currentTab != newTabIndex) {
				thisObj.DOMElement.currentTab = newTabIndex;
			}
			//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
			event.stopPropagation();
		});
		
		//Покажем выбранный таб
		thisObj.DOMElement.currentTab = thisObj.currentTab;
	}
}
inherit(WATabs, ui.WAElement);
/* STATIC */

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
		oldValue = thisObj.currentTab,
		ev = new CustomEvent("tabchange", {bubbles : true, cancelable : true});
	if(newValue >= thisObj.subTabs.length) {
		//console.error("new tab index value too must newValue = '" + newValue + "'. Max: '" + (thisObj.subTabs.length - 1) + "'");
		newValue = thisObj.subTabs.length - 1;
	}
	
	thisObj.currentTab = ev["currentTab"] = newValue;
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
				return thisObj.currentTab;
			},
			"set" : function(newValue) {
				if(!isNaN(newValue = parseInt(newValue))) {
					thisObj.showTab(newValue);
				}
				return thisObj.currentTab;
			}, "ielt8" : true
		},
		"tabCount" : {
			"get" : function() {
				return thisObj.tabsCount;
			}, "ielt8" : true
		}
	});

	//IE < 8
	if(_element["getcurrentTab"] && _element["addBehavior"]) {
		_element["addBehavior"]("class.ui.WATabs.ielt8.htc");
	}
}

})(window);