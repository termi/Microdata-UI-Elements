/*
 * @requared ui.ImageGallery
 */

;(function(global) {//closure

// IMPORT
var ui = global["ui"] = global["ui"] || {};

/**
 * Microdata type - onlifeschema.org/SlideShow
 * @constructor
 * @extends {ui.ImageGallery}
 * @param {...} _params Params list the same as in ui.ImageGallery
 */
var SlideShow = ui["SlideShow"] = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	SlideShow["superclass"].constructor.apply(thisObj, arguments);

/* PRIVATE */

/* PROTECTED */
	/** Ссылка на метод init родительского класса
	 * @private
	 * @type {Function}	 */
	thisObj._superInit = thisObj["init"];//Сохраняем ссылку
	
	/** @type {number} */
	thisObj._interval;
	
/* SETTINGS */
	thisObj.settings.timeOut = 5000;
	
/* PUBLIC */
	
/* PUBLIC | FUNCTIONS */

/* INIT */
	thisObj["init"] = SlideShow.prototype["init"];
}
Object["inherit"](SlideShow, ui["ImageGallery"]);
/* STATIC */

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
SlideShow.prototype.microdataType = "onlifeschema.org/SlideShow";

/**
 * Инициализация
 */
SlideShow.prototype["init"] = function() {
	var thisObj = this;
		
	//Вызываем метод родительского класса
	if(thisObj._superInit.apply(thisObj, arguments) === false)return false;
	
	
	
	//Подпишемся на события::
	thisObj.DOMElement.addEventListener("showimage", function(event) {
		clearInterval(thisObj._interval);
		thisObj._interval = setInterval(thisObj.timer.bind(thisObj), thisObj.settings.timeOut);
	})
	
	thisObj._interval = setInterval(thisObj.timer.bind(thisObj), thisObj.settings.timeOut);
}

SlideShow.prototype.timer = function() {
	var thisObj = this;
	
	var currentImage = thisObj.currentImage + 1;
	if(currentImage >= thisObj.imageCount)currentImage = 0;
	
	thisObj.images[currentImage].dispatchEvent(new Event("click"));
}
})(window);