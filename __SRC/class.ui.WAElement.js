/**
 * @requared Utils.Dom.isEmptyElement
 * @requared MicroformatError
 * @requared MicroformatConstructors
 */

;(function(global) {//closure


var ui = global.ui = global.ui || {},
	_isEmptyElement = global["Utils"]["Dom"]["isEmptyElement"];

/**
 * Класс, общий для всех UI-объектов
 * @constructor
 * @param {Node} _element DOM-Элемент, который будет ассоциироватся с данным объектом
 * @param {ui.WAElement|ui.WebApplication} _owner Владелей этого компонента
 */
var WAElement = ui["WAElement"] = function(_element, _owner) {
	if(global.DEBUG) {
		if(typeof _element == undefType)console.error("[ui.WAElement] new:: Элемент должен быть задан")
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
	thisObj.options = {};
	
/* PROTECTED */

/* PUBLIC */
	/** @const
	 * @type {Node} */
	thisObj.DOMElement = _element;
	
	/** Components of this component
	 * @type {HTMLPropertiesCollection} */
	thisObj.сomponents;
	
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
		if(urn && (urn.substr(0, 15) === "urn:onlife:apps") && !thisObj.templateLoaded) {//Проверим на наличие и, что это уникальный идентификатор ресурса
			
			ResourceManager.loadResource(urn, function(jsonOrText) {
			
				function step2(container) {
					//Инициализируем, если надо приложение
					if(typeof jsonOrText == "object") {
						var constructor = jsonOrText["constructor"],
							application = new constructor(container);
						application.init();
					}
				}
				
				function createNodeFromText(text, container) {
					var df = document.createDocumentFragment(),
						el = df.appendChild(document.createElement("div"));
					el.innerHTML = text;
					el = el.firstChild;
					
					$A(el.attributes).forEach(function(attr) {
						if(attr.name == "class") {
							$A(el.classList).forEach(function(className) {
								container.classList.add(className);
							})
						}
						container.setAttribute(attr.name, attr.value);
					})
					
					$A(el.childNodes).forEach(function(child) {
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
					step2(_element);
					//Заново запускаем инициализацию
					thisObj.init();
				}
				
			});
			
			//Поднимаем флаг, что мы уже загружали шаблон или приложение
			thisObj.templateLoaded = true;
				
			//Останавливаем инициализацию
			return false;
		}
		/*\ Переделать END \*/
		
		
		//Первоначальная инициализация
		
		//_element.setAttribute("data-element-is-init", "true");//for tests
		//if(!window.asdf)window.asdf = [];window.asdf.push(this);//for tests
					
		//Если у элемента есть id - назначаем его, нету - рандомная строка
		thisObj.id = _element.id || (_element.id = randomString(9) + "_");
		
		/** Components of this component
		 * @type {Array.<Node>} */
		thisObj.properties = _element["properties"];
		
		//Пройдёмся по всем под-компонентам и инициализируем их
		thisObj.сomponents = thisObj.properties["component"];
		$A(thisObj.сomponents).forEach(function(_component) {
			var _itemType = _component.getAttribute("itemtype");
			if(_itemType === null)
				throw new MicroformatError("itemscope attribute need");
			
			_itemType.split(" ").forEach(function(type) {
				var constructor = MicroformatConstructors[type];
				if(!constructor)console.error("unkonown component type : " + type);
				else {
					var newComponentBehavior = new constructor(_component, thisObj);
					//TODO:: Отложить init и вызывать его только тогда, когда он действительно необходим
					newComponentBehavior.init();
				}
			})
		})		
		
		//Подпишемся на события
		_element.addEventListener("show", function(event) {
			//Если компонент был скрыт с помощью style - уберём скрытие
			var style = _element.getAttribute("style");
			if(style) {
				style = style.replace(": ", ":").replace(" :", ":").replace("display:none", "");
				_element.setAttribute("style", style);
			}
			
			this.classList.add("select");
		})
		_element.addEventListener("hide", function(event) {
			this.classList.remove("select");
		})
				
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
	this.DOMElement.dispatchEvent(new CustomEvent("show", {bubbles : false}));
}
/**
 * Скрыть элемент.
 * @this {ui.WAElement}
 */
WAElement.prototype.hide = function() {
	this.DOMElement.dispatchEvent(new CustomEvent("hide", {bubbles : false}));
}

})(window);