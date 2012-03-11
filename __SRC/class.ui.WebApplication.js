/*
 * @requared ui.WAElement
 * @requared global["ResourceManager"]
 */

;(function(global) {//closure

// IMPORT
var ui = global["ui"] = global["ui"] || {};

var _urnPrefix = "urn",
	/** @type {string} @const */
	__SCRIPT_ID_PREFIX__ = "scr" + randomString(5),
	_isEmptyElement = function(element) {
		var isEmpty = !element.firstChild, i = 0;
		
		if(!isEmpty) {
			isEmpty = true;
			
			while((el = element.childNodes[i++]) && isEmpty)
				isEmpty = el.nodeType === 3 && el.nodeValue.trim() === "";
		}
		
		return isEmpty;
	},
	_forEach = Function.prototype.call.bind(Array.prototype.forEach);
	
/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WebApplication
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var WebApplication = ui["WebApplication"] = function (_element, _owner) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WebApplication["superclass"].constructor.apply(thisObj, arguments);
	
/* PUBLIC */
	/** Форма авторизации @type {ui.WAElement} */
	thisObj.authForm = null;
	
	thisObj.account = {
		status : {
			login : false
		}
	}
	
	

/* PUBLIC | FUNCTIONS */
	
	/*thisObj.updateAccountStatus = function() {
		System.Request.Add(function(respons) {
			thisObj.DOMElement.dispatchEvent(new CustomEvent("accountstatusupdate", {bubbles : true, detail : respons}))
		}, "c", "a");
		System.Request.Send();
	}
	
	thisObj.applicationExit = function(saveSession) {
		function step2() {
			Cookie.remove("uidh");
			Cookie.remove("uidl");
			//Перезагружаем страницу
			location.reload(true);
		}
		
		if(!saveSession) {
			System.Request.Add(step2, "a", "l");
		}
		else location.reload(true);
	}*/
	
/* INIT */
	/** Ссылка на метод init родительского класса
	 * @private
	 * @type {Function}	 */
	var superInit = thisObj["init"];//Сохраняем ссылку
	/**
	 * Инициализация
	 */
	thisObj["init"] = function() {
		//Вызываем метод родительского класса
		if(superInit.apply(thisObj, arguments) === false)return false;
		
		//Пробуем получить уникальный идентификатор ресурса
		var urn = _element.getAttribute("itemid"),
			urns = (urn || "").split(":"),
			isURN = urns[0] === _urnPrefix;
		if(isURN && !thisObj.templateLoaded) {//Проверим на наличие и, что это уникальный идентификатор ресурса
			
			global["ResourceManager"].loadResource(urn, function(jsonOrText, realUrl) {
			
				thisObj.loadJSApplication(jsonOrText, realUrl, step1);
			
				function step2(container, _element) {
					//Инициализируем, если надо приложение
					if(typeof jsonOrText == "object") {
						var _constructor = jsonOrText["app"],
							application = new _constructor(container);
						application["init"](_element);
					}
				}
				
				function createNodeFromText(text, container) {
					var df = document.createDocumentFragment(),
						el = df.appendChild(document.createElement("div"));
					el.innerHTML = text;
					el = el.firstChild;
					
					_forEach(el.attributes, function(attr) {
						if(attr.name == "class") {
							_forEach(el.classList, function(className) {
								container.classList.add(className);
							})
						}
						container.setAttribute(attr.name, attr.value);
					})
					
					var ch;
					while(ch = el.childNodes[0]) {
						/*if(ch.nodeType == 3)el.removeChild(ch);
						else ЗАЧЕМ ????*/
							container.appendChild(ch);
					}
					
					//Вычищаем
					el.innerHTML = "";
					df = el = null;
				}
				
				function step1() {
					//Проверим не пустой ли у нас элемент
					if(_isEmptyElement(_element)) {
						if(typeof jsonOrText == "object") {
							if(jsonOrText["html"])
								global["ResourceManager"].loadTextResource(urn + "/" + jsonOrText["html"], function(text) {
									if(text == "") {
										console.error("Empty answer for '" + urn + "' request");
									}
									else {
										createNodeFromText(text, _element);
										step2(jsonOrText, _element);
										
										//Заново запускаем инициализацию
										thisObj["init"]();
									}
								}, function() {
									console.error("Some error fired while sending '" + urn + "' request");
								})
							else {
								console.error("Need `html` teamplete in 'html' property")
							}
						}
						else {
							createNodeFromText(jsonOrText, _element);
							step2(jsonOrText, _element);
							
							//Заново запускаем инициализацию
							thisObj["init"]();
						}
						
					}
					else {
						step2(jsonOrText, _element);
						//Заново запускаем инициализацию
						//TODO:: Нужно ли??? ?? thisObj["init"]();
					}
				}
			});
			
			//Поднимаем флаг, что мы уже загружали шаблон или приложение
			thisObj.templateLoaded = true;
			return false;//Предотвращаем дальнейшую инициализацию
		}
		
		/*var tmp;

		//temp START TODO:: переделать
		thisObj.услуги = thisObj.properties["component"][0]["properties"]["услуги"][0];
		//thisObj.общение = thisObj.properties["component"][0]["properties"]["общение"][0];
		//temp END
		
		
		thisObj.authForm = thisObj.properties["authForm"][0];
		//Подпишемся на события::
		thisObj.DOMElement.addEventListener("submit", thisObj.updateAccountStatus.bind(thisObj))
		
		//Подпишемся на события::
		//Сообщения об изменеии thisObj.DOMElement.currentTab
		thisObj.DOMElement.addEventListener("accountstatusupdate", function(event) {
			var tmp;
			if(!(tmp = event.detail) || !(tmp = tmp.data) || !(tmp.userState) || 
				tmp.userState === 0)//Пользователь не залогинин
			{
				//ОШИБКА!!!
				thisObj.account.status = false
			}
			else {
				thisObj.account.status = tmp.userState;
				thisObj.account.userId = tmp.userId;
			}
			
			//Получение состояния пользователя:
			//0 – не аутентифицирован,
			//2 – аутентифицирован, не персонализирован,
			//3 – аутентифицирован, персонализирован, не авторизирован (без паспортных и др. персональных данных),
			//4 – аутентифицирован, персонализирован, авторизирован
			
			//TODO::
			
			if(!thisObj.account.status) {
				//Пользователь не авторизирован
				thisObj.showAuthForm();
			}
			else {
				//Пользователь успешно авторизирован
				//temp START TODO:: переделать
				thisObj.услуги.dispatchEvent(new CustomEvent("show", {bubbles : true}))
				//temp END
			}
			
			//Предотвращяем всплытие события
			event.stopPropagation();
			return false;
		})
		thisObj.updateAccountStatus();*/
		
		//Событие выхода пользователя из приложения - разрываем сессию и перезагружаем страницу
		//thisObj.DOMElement.addEventListener("userlogout", thisObj.updateAccountStatus.bind(thisObj))
		
	}
}
Object["inherit"](WebApplication, ui["WAElement"]);
/* STATIC */

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WebApplication.prototype.microdataType = "onlifeschema.org/WebApplication";
/**
 * Показать форму авторизации
 */
WebApplication.prototype.showAuthForm = function() {
	if(this.authForm)this.authForm.dispatchEvent(new CustomEvent("show", {bubbles : true, cancelable : true}))
}


WebApplication.prototype.processUrl = function(url, origin) {
	return url.charAt(0) == "/" ? url :
		(/^http(s?)\:\/\//ig).test(url) ? url :
		(origin + "/" + url);
}

WebApplication.prototype.loadJSApplication = function(jsonText, realUrl, onDone) {
	var thisObj = this,
		json, html, cssArray, jsArray, applicationId,
		style_or_script_id;
	
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
	
	//TODO:: 
	//1. Убрать отсюда разбор JSON и переместить его в конструктор Application
	//2. Передавать JSON в конструктор Application
	//3. Проверять json на валидность
	
	applicationId = json["id"];
	//Ожидаем JSON определённого формата
	//Загрузим необходимые css-файлы
	cssArray = json["css"];
	if(cssArray)cssArray.forEach(function(css, key) {
		style_or_script_id = "style_" + applicationId + "_" + key;
		if(!document.getElementById(style_or_script_id))
			global["ResourceManager"].createStyle(thisObj.processUrl(css, realUrl), null, style_or_script_id);
	})
	//Загрузим необходимые js-файлы
	jsArray = json["js"];
	if(jsArray)jsArray.forEach(function(js, key) {
		style_or_script_id = "script_" + applicationId + "_" + key;
		if(!document.getElementById(style_or_script_id))
			global["ResourceManager"].createScript(thisObj.processUrl(js, realUrl), null, style_or_script_id);
	})
	
	//Основной js-файл приложения должен экспортировать метод init(DOMElement) в глобальный объект export
	if(json["app"]) {
		if(typeof json["app"] == "object") {
			Object.extend(json, json["app"]);
			onDone();
		}
		else if(typeof json["app"] == "function") {
			onDone();
		}
		else {
			global["ResourceManager"].createScript(thisObj.processUrl(json["app"], realUrl), function() {
				//onload
				
				var exports = 
					global["exports"];
				if(!exports) {
					console.info("Application '" + applicationId + "' has no exported functions");
				}
				else {
					Object.extend(json, exports);
					//save exports for next time `application` use
					global["ResourceManager"]["applications"][realUrl] = json;
					
					delete global["exports"];
					global["exports"] = exports = null;
					
					onDone();
				}
				
			}, applicationId ? (__SCRIPT_ID_PREFIX__ + applicationId) : 0);
		}
	}
}

})(window);