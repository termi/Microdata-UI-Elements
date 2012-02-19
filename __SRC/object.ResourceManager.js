;(function(global, ajax) {//closure

if(global["ResourceManager"])return;//Avoid recreating

var ResourceManager = global["ResourceManager"] = new
/**
 * @constructor
 */
function() {
	var thisObj = this;
	
/* PRIVATE */
	var _urnPrefix = "urn:onlife:",
		_urnPrefix_length = _urnPrefix.length,
		/** @type {string} @const */
		__SCRIPT_ID_PREFIX__ = "scr" + randomString(5),
		/** @type {string} @const */
		__DEFAULT_APPLICATION_FILE__ = "index.json";

/* PRIVATE | FUNCTIONS */
	function _processUrl(url, origin) {
		return url.charAt(0) == "/" ? url :
			(/^http(s?)\:\/\//ig).test(url) ? url :
			(origin + "/" + url);
	}
	
	function _deleteCreateAndAppendElement(_tagName, _id) {
		var el;
		(el = _id ? document.getElementById(_id) : 0) &&
			el.parentNode.removeChild(el);//Удалим старый элемент
		
		document.head.appendChild(
			el = document.createElement(_tagName)
			).id = _id;
		
		return el
	}
		
/* PUBLIC */
	/**
	 * Массив приложений
	 */
	thisObj.applications = {};

/* PUBLIC | FUNCTIONS */
	/**
	 * Функция создаёт скрипт
	 * @param {string} _src Путь до скрипта
	 * @param {Function} _onLoad Callback по загрузки скрипта
	 * @param {string} _id Уникальный идентификатор элемента
	 * @return {HTMLScriptElement}
	 */
	thisObj.createScript = function(_src, _onLoad, _id) {
		var script = _deleteCreateAndAppendElement("script", _id);
		script.onload = _onLoad;
		script.src = _src;
		return script;
	}
	
	/**
	 * Функция создаёт стиль
	 * @param {string} _src Путь до скрипта
	 * @param {string} _id Уникальный идентификатор элемента
	 * @return {HTMLLinkElement}
	 */
	thisObj.createStyle = function(_src, _id) {
		var link = _deleteCreateAndAppendElement("link", _id);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", _src);
		return link;
	}
	
	/**
	 * Загрузка ресурса.
	 * По содержанию строки определяет какой ресурс загрузить и выполняет соотв. функцию
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: (string|Object))} onDone Callback-функция вызывается после получения данных. В первом параметре передаётся полученный текст или ссылка на загруженное приложение
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 */
	thisObj.loadResource = function(url, onDone, onError) {
		//Уникальный идентификатор ресурса должен начинатся на "urn:onlife:"
		var isURN = (url.substr(0, _urnPrefix_length) === _urnPrefix);
		
		if(isURN) {
			if(url.substr(_urnPrefix_length, 9) === "templates") {//Если это шаблон
				//thisObj.loadTemplate(url, onDone, onError);
				//TODO::
				onDone("")
				return;
			}
			else if(url.substr(_urnPrefix_length, 4) === "apps") {//Если это приложение
				thisObj.loadApplication(url, onDone, onError);
				return;
			}
		}
		else {
			//TODO::
			onDone("")
			//thisObj.loadTextResource(url, onDone, onError);
		}
	}
	
	/**
	 * Загружает шаблон
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: string)} onDone Callback-функция вызывается после получения данных. В первом параметре передаётся полученный текст
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 */
	thisObj.loadTemplate = function(url, onDone, onError) {
		var isURN = (url.substr(0, _urnPrefix_length) === _urnPrefix);
		if(isURN) {
			//Удалим префикс
			url = url.substr(_urnPrefix_length);
			//Заменяем двоеточия на слеши
			url = url.replace(/\:/g, "/");
		}
		
		ajax(url, function(jsonText) {
			var json, html, cssArray, jsArray;
			try {
				json = JSON.parse(jsonText);
			}
			catch(e) {
				console.error("Can't parse JSON | error message: " + e.message);
				return false;
			}
			//Ожидаем JSON определённого формата
			//Загрузим необходимые css-файлы
			cssArray = json.css;
			if(cssArray)cssArray.forEach(function(css) {
				thisObj.createStyle(css);
			})
			
			html = json.html;
			if(html)onDone(html)
			else {
				console.error("No 'html' in json object");
				onError();
			}
		}, onError);
	}
	
	
	/**
	 * Загружает приложение
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: Object)} onDone Callback-функция вызывается после получения данных. В первом параметре передаётся ссылка на загруженное приложение
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 */
	thisObj.loadApplication = function(url, onDone, onError) {
		var isURN = (url.substr(0, _urnPrefix_length) === _urnPrefix);
		if(isURN) {
			//Удалим префикс
			url = url.substr(_urnPrefix_length);
			//Заменяем двоеточия на слеши
			url = url.replace(/\:/g, "/");
		}
		
		//Проверим, есть ли у меня закешированное приложение
		if(thisObj.applications[url]) {
			onDone(thisObj.applications[url]);
			return;
		}
	
		ajax(url + "/" + __DEFAULT_APPLICATION_FILE__, function(jsonText) {
			var json, html, cssArray, jsArray, applicationId;
			try {
				json = JSON.parse(jsonText);
			}
			catch(e) {
				console.error("Can't parse JSON | error message: " + e.message);
				return false;
			}
			
			//TODO:: 
			//1. Убрать отсюда разбор JSON и переместить его в конструктор Application
			//2. Передавать JSON в конструктор Application
			
			applicationId = json.id;
			//Ожидаем JSON определённого формата
			//Загрузим необходимые css-файлы
			cssArray = json.css;
			if(cssArray)cssArray.forEach(function(css, key) {
				thisObj.createStyle(_processUrl(css, url), null, "style_" + applicationId + "_" + key);
			})
			//Загрузим необходимые js-файлы
			jsArray = json.js;
			if(jsArray)jsArray.forEach(function(js, key) {
				thisObj.createScript(_processUrl(js, url), null, "script_" + applicationId + "_" + key);
			})
			
			//Основной js-файл приложения должен экспортировать метод init(DOMElement) в глобальный объект export
			if(json.app)thisObj.createScript(_processUrl(json.app, url), function() {
				//onload
				
				var exports = global["exports"];
				if(!exports) {
					console.info("Application '" + applicationId + "' has no exported functions");
				}
				else {
					Object.append(json, exports);
					thisObj.applications[url] = json;
					
					delete global["exports"];
					global["exports"] = exports = null;
				}
				if(onDone)onDone(json);
				
			}, applicationId ? (__SCRIPT_ID_PREFIX__ + applicationId) : 0);
			
			
			
		}, onError);
	}
	
	/**
	 * Загружает текстовый ресурс
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: string)} onDone Callback-функция вызывается после получения данных
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 */
	thisObj.loadTextResource = function(url, onDone, onError) {
		var isURN = (url.substr(0, _urnPrefix_length) === _urnPrefix);
		if(isURN) {
			//Удалим префикс
			url = url.substr(_urnPrefix_length);
			//Заменяем двоеточия на слеши
			url = url.replace(/\:/g, "/");
		}
		
		ajax(url, onDone, onError);
	}
};

})
(
	window,
	/**
	 * @param {string} url
	 * @param {function(String)} onDone
	 * @param {function(XMLHttpRequest)} onError
	 * @param {boolean=} isPost [default=false] POST?
	 */
	function(url, onDone, onError, isPost) {//AJAX
		if(isPost == void 0)isPost = false;
		
		var params;
		
		if(isPost) {
			params = url.split("?")[1];
			url = url.split("?")[0];
		}
		
		SendRequest(url, params || "",
			function(xhr) {
				onDone(xhr.responseText);
			},
			onError,
			{"post" : isPost}
		);
	},
	/**
	 * @param {Array.<string>} resourses
	 * @param {Function} callback
	 */
	function (resourses, callback) {//LoadResourses
		//TODO::
	}
);