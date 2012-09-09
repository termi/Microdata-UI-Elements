;(function(global, ajax) {//closure

if(global["ResourceManager"])return;//Avoid recreating

var ResourceManager = global["ResourceManager"] = new
/**
 * @constructor
 */
function() {
	var thisObj = this;
	
/* PRIVATE */
	var _urnPrefix = "urn"
		/** @type {string} @const */
		, __SCRIPT_ID_PREFIX__ = "scr" + Math.random()
		/** @type {string} @const */
		, __DEFAULT_APPLICATION_FILE__ = "index.json"

		, _loadedQueue = []

		, _xhr = new XMLHttpRequest
	;

/* PRIVATE | FUNCTIONS */
	
	function _deleteCreateAndAppendElement(_tagName, _id) {
		var el;
		(el = _id ? document.getElementById(_id) : 0) &&
			el.remove();//Удалим старый элемент
		
		document.head.appendChild(
			el = document.createElement(_tagName)
			).id = _id;
		
		return el
	}
		
/* PUBLIC */
	/**
	 * Application array
	 */
	thisObj["applications"] = {};

/* PUBLIC | FUNCTIONS */
	/**
	 * Create script tag with src, id and onload callback
	 * @param {string} _src script path
	 * @param {Function} _onLoad onload callback
	 * @param {string} _id uuid for element
	 * @return {HTMLScriptElement}
	 */
	thisObj.createScript = function(_src, _onLoad, _id) {
		var script = _deleteCreateAndAppendElement("script", _id);
		script.onload = _onLoad;
		script.src = _src;
		return script;
	};
	
	/**
	 * Create style sheet
	 * @param {string} _src style path
	 * @param {string} _id uuid for element
	 * @return {HTMLLinkElement}
	 */
	thisObj.createStyle = function(_src, _id) {
		var link = _deleteCreateAndAppendElement("link", _id);
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", _src);
		return link;
	};
	
	/**
	 * Resource load
	 *  Function detect resource type by urn
	 * @param {string} urn path to resource
	 * @param {function(response: (string|Object))} onDone callback when resource successfully loaded
	 * @param {Function=} onError callback when we failed to loaded resource
	 * @param {Function=} _next_callbacl __FOR_SYSTEM_USE__
	 */
	thisObj.loadResource = function(urn, onDone, onError, _next_callbacl) {
		//URN mast start with "urn:"
		if(!urn["startsWith"]("urn:"))return;

		var urns = urn.split(":"),
			isURN = urns[0] === _urnPrefix,
			realUrl = urns.length == 1 ? urns[0] : urn.substr(urns[0].length + (urns[1] && urns[1].length || 0) + urns.length - 1);
		
		if(_next_callbacl) {
			_next_callbacl(urn, onDone, onError, realUrl);
			return;
		}
		
		if(isURN)switch(urns[1]) {
			case "app":
				thisObj.loadApplication(urn, onDone, onError, realUrl);
			break;
			case "templates":
			default:
				//thisObj.loadTemplate(url, onDone, onError, urns[urns.length - 1]);
				//TODO::
				onDone("", realUrl);
			break;
		}
		else {
			//TODO::
			onDone("", realUrl);
			//thisObj.loadTextResource(url, onDone, onError, urns[urns.length - 1]);
		}
	};

	/**
	 * Application load
	 * @param {string} urn path to resource
	 * @param {function(responseText: Object)} onDone callback when resource successfully loaded
	 * @param {Function=} onError callback when we failed to loaded resource
	 * @param {string=} _sys_realUrl __FOR_SYSTEM_USE__
	 */
	thisObj.loadApplication = function(urn, onDone, onError, _sys_realUrl) {
		if(_sys_realUrl == void 0) {
			if(_sys_realUrl === "") {
				console.warning("Null resource -> Nothing to load!");
				return;
			}
			thisObj.loadResource(urn, onDone, onError, thisObj.loadApplication);
			return;
		}
		
		//Check cached application
		if(thisObj["applications"][_sys_realUrl]) {
			onDone(thisObj["applications"][_sys_realUrl], _sys_realUrl);
			return;
		}

		_loadedQueue.push(function(appName, appIndexSrc, ondone, onerror) {
			var getNextFunc = this;

			_xhr.open("GET", appIndexSrc);
			_xhr.responseType = "json";
			_xhr.onload = function() {
				thisObj["applications"][appName] = this.response;
				ondone();
			};
			_xhr.onloadend = getNextFunc();
			_xhr.ontimeout = _xhr.onerror = _xhr.onabort = onerror;
			_xhr.send(null);
		}.bind(
			_loadedQueue.pop.bind(_loadedQueue),
			_sys_realUrl, _sys_realUrl + "/" + __DEFAULT_APPLICATION_FILE__,
			onDone,
			onError
		));

		if(_loadedQueue.length == 1)(_loadedQueue.pop())();//Start queue
	};
	
	/**
	 * Загружает текстовый ресурс
	 * @param {string} url Путь к ресурсу
	 * @param {function(responseText: string)} onDone Callback-функция вызывается после получения данных
	 * @param {Function=} onError Callback-функция вызывается при ошибке в получении данных
	 * @param {string=} _sys_realUrl Не указывается напрямую. Вычесленный url-ресурса
	 */
	thisObj.loadTextResource = function(url, onDone, onError, _sys_realUrl) {
		if(_sys_realUrl == void 0) {
			if(_sys_realUrl === "") {
				console.warning("Null resource -> Nothing to load!");
				return;
			}
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

		var xhr = new XMLHttpRequest();
		xhr.open(isPost ? "POST" : "GET", url);
		xhr.onload = function() {
			onDone(this.responseText);
		};
		xhr.send(isPost ? url : null);
	}
);
