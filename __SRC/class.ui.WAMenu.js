/*
 * @requared ui.WAElement
 */

;(function(global) {//closure

var ui = global.ui;

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WAMenu
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var WAMenu = ui["WAMenu"] = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WAMenu.superclass.constructor.apply(thisObj, arguments);
	
/* PRIVATE */

/* PRIVATE | FUNCTIONS*/
	/**
	 * Event listener for menuItems
	 * @this {HTMLElement} Элемент на который мы повесим этот обработчик
	 */
	var _menuItemsOnClick = bubbleEventListener(WAMenu.menuEventDetailAttribute, function(event, elem, elemAttrValue) {
		var ev = new CustomEvent(thisObj.menuEvent, {bubbles : true, cancelable : true, detail : elemAttrValue})
		
		//Создаём событие, которое "всплывёт" до нужного обработчика или до document
		thisObj.DOMElement.dispatchEvent(ev);
		
		return false;
	});


/* PUBLIC */	
	/*
	 * Пункты меню
	 * @type {Array.<Node>}
	 */
	//thisObj.menuItems;

	thisObj.menuEvent = thisObj.DOMElement.getAttribute(WAMenu.menuEventAttribute);
	
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
		
		
		if(!thisObj.menuEvent && global.DEBUG) {
			console.error("WAMenu element must have value in '" + WAMenu.menuEventAttribute + "' attribute");
		}
		
		//Menu event listener init
		var _dispatcherEventName = 
			thisObj.DOMElement.getAttribute(WAMenu.menuEventDispatcher) || 
			WAMenu.menuEventDefaultDispatchers[thisObj.DOMElement.tagName.toUpperCase()] ||
			WAMenu.menuEventDefaultDispatchers["*"];
		
		thisObj.DOMElement.addEventListener(_dispatcherEventName, _menuItemsOnClick, false);
		
		//Alias
		//thisObj.menuItems = thisObj.DOMElement.properties["menuItem"];
	}
}
Object.inherit(WAMenu, ui.WAElement);

/* STATIC */
/** @const */
WAMenu.menuEventAttribute = "data-menu-event";
/** @const */
WAMenu.menuEventDetailAttribute = "data-menu-detail";
/** @const */
WAMenu.menuEventDispatcher = "data-trigger-event";
/** Default `menuEventDispatcher` values for tagName
 * @const @enum {string} */
WAMenu.menuEventDefaultDispatchers = {
	"*" : "click",
	"FORM" : "submit"
}

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAMenu.prototype.microdataType = "onlifeschema.org/WAMenu";



})(window);