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
	var _menuEvent = thisObj.DOMElement.getAttribute(WAMenu.menuEventAttribute);
	if(!_menuEvent && global.DEBUG) {
		console.error("WAMenu element must have value in '" + WAMenu.menuEventAttribute + "' attribute");
	}
	
/* PRIVATE | FUNCTIONS*/
	/**
	 * Event listener for menuItems
	 */
	var _menuItemsOnClick = bubbleEventListener(WAMenu.menuEventDetailAttribute, function(event, elem, elemAttrValue) {
		var ev = new CustomEvent(_menuEvent, {bubbles : true, cancelable : true, detail : elemAttrValue})
		
		//Создаём событие, которое "всплывёт" до нужного обработчика или до document
		thisObj.DOMElement.dispatchEvent(ev)
	});


/* PUBLIC */	
	/**
	 * Пункты меню
	 * @type {Array.<Node>}
	 */
	thisObj.menuItems;
	
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
		
		if(_menuEvent)(thisObj.menuItems = $A(thisObj.properties["menuItem"])).forEach(function(item) {
			item.addEventListener("click", _menuItemsOnClick, false);
			//TODO:: Проверить, чтобы событие не обрабатывалось более 1го раза
			item.addEventListener("touchstart", _menuItemsOnClick, false);
			item.addEventListener("touchend", _menuItemsOnClick, false);
		});
	}
}
inherit(WAMenu, ui.WAElement);
/* STATIC */
WAMenu.menuEventAttribute = "data-menu-event";
WAMenu.menuEventDetailAttribute = "data-menu-detail";


/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAMenu.prototype.microdataType = "onlifeschema.org/WAMenu";



})(window);