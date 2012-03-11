;(function(global, ajax) {//closure

if(global["ResourceManager"])return;//Avoid recreating

var ResourceManager = global["ResourceManager"] = new
/**
 * @constructor
 */
function() {
	var thisObj = this;
	
/* PRIVATE */
	var _urnPrefix = "urn",
		/** @type {string} @const */
		__SCRIPT_ID_PREFIX__ = "scr" + randomString(5),
		/** @type {string} @const */
		__DEFAULT_APPLICATION_FILE__ = "index.json";

/* PRIVATE | FUNCTIONS */
	
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
	thisObj["applications"] = {};

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
	 * @param {Function=} _next_callbacl Не указывается напрямую. Точка возврата
	 */
	thisObj.loadResource = function(url, onDone, onError, _next_callbacl) {
		//Уникальный идентификатор ресурса должен начинатся на "urn:"
		var urns = url.split(":"),
			isURN = urns[0] === _urnPrefix,
			realUrl = url.substr(urns[0].length + urns[1].length + 2);
		
		if(_next_callbacl) {
			_next_callbacl(url, onDone, onError, realUrl);
			return;
		}
		
		if(isURN)switch(urns[1]) {
			case "templates":
				//thisObj.loadTemplate(url, onDone, onError, urns[urns.length - 1]);
				//TODO::
				onDone("", realUrl)
			break;
			
			case "app":
				thisObj.loadApplication(url, onDone, onError, realUrl);
			break;
		}
		else {
			//TODO::
			onDone("", realUrl)
			//thisObj.loadTextResource(url, onDone, onError, urns[urns.length - 1]);
		}
	}
	
	/**
	 * Загружает шаблон
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: string)} onDone Callback-функция вызывается после получения данных. В первом параметре передаётся полученный текст
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 * @param {string=} _sys_realUrl Не указывается напрямую. Вычесленный url-ресурса
	 */
	thisObj.loadTemplate = function(url, onDone, onError, _sys_realUrl) {
		if(!_sys_realUrl) {
			thisObj.loadResource(url, onDone, onError, thisObj.loadTemplate);
			return;
		}
		
		ajax(_sys_realUrl, function(jsonText) {
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
			cssArray = json["css"];
			if(cssArray)cssArray.forEach(function(css) {
				thisObj.createStyle(css);
			})
			
			html = json["html"];
			if(html)onDone(html, _sys_realUrl)
			else {
				console.error("No 'html' in json object");
				onError();
			}
		}, function() {
			onError("Error", _sys_realUrl);
		});
	}
	
	
	/**
	 * Загружает приложение
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: Object)} onDone Callback-функция вызывается после получения данных. В первом параметре передаётся ссылка на загруженное приложение
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 * @param {string=} _sys_realUrl Не указывается напрямую. Вычесленный url-ресурса
	 */
	thisObj.loadApplication = function(url, onDone, onError, _sys_realUrl) {
		if(!_sys_realUrl) {
			thisObj.loadResource(url, onDone, onError, thisObj.loadApplication);
			return;
		}
		
		//Проверим, есть ли у меня закешированное приложение
		if(thisObj["applications"][_sys_realUrl]) {
			onDone(thisObj["applications"][_sys_realUrl], _sys_realUrl);
			return;
		}
	
		ajax(_sys_realUrl + "/" + __DEFAULT_APPLICATION_FILE__, function(jsonText) {
			var json;
			
			if(typeof jsonText != "object") {
				try {
					json = JSON.parse(jsonText);
				}
				catch(e) {
					console.error("Can't parse JSON | error message: " + e.message);
					return false;
				}
			}
			else json = jsonText;
			
			thisObj["applications"][_sys_realUrl] = json;
			
			onDone(json, _sys_realUrl);
		}, function() {
			onError("Error", _sys_realUrl);
		});
	}
	
	/**
	 * Загружает текстовый ресурс
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: string)} onDone Callback-функция вызывается после получения данных
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 * @param {string=} _sys_realUrl Не указывается напрямую. Вычесленный url-ресурса
	 */
	thisObj.loadTextResource = function(url, onDone, onError, _sys_realUrl) {
		if(!_sys_realUrl) {
			thisObj.loadResource(url, onDone, onError, thisObj.loadTextResource);
			return;
		}
		
		ajax(_sys_realUrl, function(res) {
			onDone(res, _sys_realUrl);
		}, function() {
			onError("Error", _sys_realUrl);
		});
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
		
		window["SendRequest"](url, params || "",
			function(xhr) {
				onDone(xhr.responseText);
			},
			onError,
			{"post" : isPost}
		);
	}
);