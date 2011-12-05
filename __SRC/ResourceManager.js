;(function(global, ajax) {//closure

var ResourceManager = global["ResourceManager"] = new function() {
	var thisObj = this;
	
/* PRIVATE */
	var _urnPrefix = "urn:onlife:",
		_urnPrefix_length = _urnPrefix.length,
		/** @type {string} @const */
		__SCRIPT_ID_PREFIX__ = "scr" + randomString(5),
		/** @type {string} @const */
		__DEFAULT_APPLICATION_FILE__ = ".js";//"/.json"

/* PRIVATE | FUNCTIONS */
	function processUrl(url, origin) {
		return url.charAt(0) == "/" ? url :
			(/^http(s?)\:\/\//ig).test(url) ? url :
			(origin + "/" + url);
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
	 */
	thisObj.createScript = function(_src, _onLoad, _id) {
		var script = document.getElementById(_id);
		
		//Удалим старый скрипт
		if(script) {
			script.parentNode.removeChild(script);
		}
		
		script = document.createElement("script");
		if(_id)script.id = _id;
		if(typeof _onLoad == "function")script.onload = _onLoad;
		script.src = _src;
		document.head.appendChild(script);
	}
	
	/**
	 * Функция создаёт скрипт
	 * @param {string} _src Путь до скрипта
	 * @param {string} _id Уникальный идентификатор элемента
	 */
	thisObj.createStyle = function(_src, _id) {
		var link = document.getElementById(_id);
		
		//Удалим старый стиль
		if(link) {
			link.parentNode.removeChild(link);
		}
		
		link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", _src);
		document.head.appendChild(link);
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
			//Удалим префикс
			url = url.substr(_urnPrefix_length);
			//Заменяем двоеточия на слеши
			url = url.replace(":", "/");
			
			if(url.substr(0, 9) === "templates") {//Если это шаблон
				//thisObj.loadTemplate(url, onDone, onError);
				onDone("")
				return;
			}
			else if(url.substr(0, 4) === "apps") {//Если это приложение
				thisObj.loadApplication(url, onDone, onError);
				return;
			}
		}
		
		onDone("")
		//thisObj.loadTextResource(url, onDone, onError);
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
			url = url.replace(":", "/");
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
	 * Загружает шаблон
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
			url = url.replace(":", "/");
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
			//Ожидаем JSON определённого формата
			//Загрузим необходимые css-файлы
			cssArray = json.css;
			if(cssArray)cssArray.forEach(function(css) {
				thisObj.createStyle(processUrl(css, url));
			})
			//Загрузим необходимые js-файлы
			jsArray = json.js;
			if(jsArray)jsArray.forEach(function(js) {
				thisObj.createScript(processUrl(js, url));
			})
			
			applicationId = json.id;
			//Основной js-файл приложения должен экспортировать метод init(DOMElement) в глобальный объект export
			if(json.app)thisObj.createScript(processUrl(json.app, url), function() {
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
			url = url.replace(":", "/");
		}
		
		ajax(url, onDone, onError);
	}
};

})
(
	window,
	function(url, onDone, onError, isPost) {//AJAX
		var params;
		if(isPost) {
			params = url.splite("?")[1];
			url = url.splite("?")[0];
		}
		
		SendRequest(url, params || "",
			function(xhr) {
				onDone(xhr.responseText);
			},
			function(xhr) {
				onError();
			},
			{"post" : isPost}
		);
	}
);