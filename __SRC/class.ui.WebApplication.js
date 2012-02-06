/*
 * @requared ui.WAElement
 */

;(function(global) {//closure

var ui = global.ui;

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WebApplication
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var WebApplication = ui["WebApplication"] = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WebApplication.superclass.constructor.apply(thisObj, arguments);
	
/* PUBLIC */
	/** Форма авторизации @type {ui.WAElement} */
	thisObj.authForm = null;
	
	/** Канал на Faye-клиенте @type {string} */
	thisObj.fayeChannel;
	
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
	var superInit = thisObj.init;//Сохраняем ссылку
	/**
	 * Инициализация
	 */
	thisObj.init = function() {
		//Вызываем метод родительского класса
		if(superInit.apply(thisObj, arguments) === false)return false;
		
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
Object.inherit(WebApplication, ui.WAElement);
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


})(window);