/*
 * @requared ui.WAElement
 */

;(function(global) {//closure

var ui = global.ui;

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - schema.org/ImageGallery
 * Слушает события: tabchange, menuopentab, show, hide
 * Создаёт события: tabchange
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var ImageGallery = ui["ImageGallery"] = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	ImageGallery.superclass.constructor.apply(thisObj, arguments);
	
/* PUBLIC */
	/** Превьюшки. Список Node's @type {PropertyNodeList} */
	thisObj.images;
	/** Открытая картинка @type {Node} */
	thisObj.openImage;

	/** Кол-во под-табов @type {number} */
	thisObj.imageCount = 0;
	
	/** Текущий выбранный под-таб @type {number} */
	thisObj.currentImage = -1;

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
		
		//Инициализируем специальные свойства контейнера табов
		//thisObj.initTabsSpetialProperties(thisObj.DOMElement);
		
		
		thisObj.openImage = thisObj.properties["primaryImageOfPage"][0];
		//Получим ссылку на контейнер табов
		thisObj.images = thisObj.properties["associatedMedia"];
		thisObj.imageCount = thisObj.images.length;
			
		
		//Подпишемся на события::
		thisObj.DOMElement.addEventListener("showimage", function(event) {
			var prevImage = thisObj.images[thisObj.currentImage],
				newImage = event.detail;
			
			//console.log("event 'tabchange' fired. oldTabIndex = '" + event["prevTab"] + "', newTabIndex = '" + event["currentTab"] + "'")
			
			if(prevImage) {
				prevImage.classList.remove("select");
			}
			if(newImage) {
				newImage.classList.add("select");
				thisObj.currentImage = Array.from(thisObj.images).indexOf(newImage);
			}
			
			if(thisObj.currentImage < 0 || !newImage)thisObj.currentImage = 0, newImage = Array.from(thisObj.images)[0];
			else if(thisObj.currentImage >= thisObj.imageCount)thisObj.currentImage = thisObj.imageCount - 1, newImage = Array.from(thisObj.images)[thisObj.currentImage];
			
			thisObj.openImage["properties"]["contentURL"][0].itemValue = newImage["properties"]["contentURL"][0].itemValue;
			thisObj.openImage["properties"]["caption"][0].itemValue = newImage["properties"]["caption"][0].itemValue;
			thisObj.openImage["properties"]["description"][0].itemValue = newImage["properties"]["description"][0].itemValue;
			
			//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
			event.stopPropagation();
		})
		
		Array.from(thisObj.images).forEach(function(imageEl, _currentIndex){
			/*if(!tabEl.itemType || !~tabEl.itemType.indexOf("onlifeschema.org/WATab")) {
				throw new Error("Таб должен быть типа onlifeschema.org/WATab")
			}*/		
			
			//Подпишемся на события
			imageEl.addEventListener("click", thisObj.previewOnClick, false);
			//TODO:: Проверить, чтобы событие не обрабатывалось более 1го раза
			imageEl.addEventListener("touchstart", thisObj.previewOnClick, false);
			imageEl.addEventListener("touchend", thisObj.previewOnClick, false);
			
			//Ищем признак выбранности превьюшки. Если нашли - вызываем событие показа превьюшки
			if(imageEl.classList.contains("select"))imageEl.dispatchEvent(new Event("click"));
		});
		
	}
}
Object.inherit(ImageGallery, ui.WAElement);
/* STATIC */

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
ImageGallery.prototype.microdataType = "schema.org/ImageGallery";

/**
 * Обработкик для превьющек

 */
ImageGallery.prototype.previewOnClick = function(event) {
	//Вызываем событие, которое всплывет к нашей галереи и обработается. В detail просто передаём ссылку на ноду с данными о превьюшке
	this.dispatchEvent(new CustomEvent("showimage", {bubbles : true, cancelable : true, detail : this}));
}
})(window);