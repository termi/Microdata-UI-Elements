/*
 * @requared ui.WAElement
 
 */
//Not now requared URL (http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html) http://static.onlf.ru/js/URL.js

;(function(global) {//closure

var ui = global.ui;

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WAForm
 * @constructor
 * @extends {ui.WAElement}
 * @param {HTMLFormElement} _element Form-Элемент, который будет ассоциироватся с данным объектом
 * @param {...} _params
 */
var WAForm = ui.WAForm = function (_element, _params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WAForm.superclass.constructor.apply(thisObj, arguments);
	
/* PRIVATE */
	function _formOnSubmit (event) {
		var _form = event.target;
		
		if(_form.tagName.toUpperCase() != "FORM")_form = _form["form"];
		
		if(!_form) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		
		var action = _form.action;
		
		if(action) {
			var params = action.split("?")[1];//TODO:: правильно обрабатывать строку вида http://examle.com?param1=value1&param2=?&param3... <-- 2 раза знак "?"
		
			//action - строка в формате paramName1={[inputName1]}&paramName2={[inputName2]}&...
			if(params)params = params.replace(/\{\[(.*?)\]\}/gi, function(str, p1) {
				if(_form[p1])return _form[p1].value;
				else return "";
				//TODO::
			})
			else {
				var j = -1,
					input;
				while(input = _form[++j]) {
					params += ((j == 0 ? "" : "&") + input.name + "=" + input.value)
				}
				//TODO::
			}
			if(global.DEBUG)console.log(action + "?" + params);
		}
		
		//TODO:: Отправляем данные
		
		
		//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
		//event.stopPropagation();
		event.preventDefault();
		return false;
	}
	
	
/* PUBLIC */
	/* Формы. {Array.<FormElement>} * /
	thisObj.forms = null;*/
	

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
		if(!superInit.apply(thisObj, arguments))return false;
		
		var tmp;

		/*thisObj.forms = Array.from(thisObj.properties["form"]);
		
		thisObj.forms.forEach(function(form){
			form.onsubmit = _formOnSubmit;
		});*/
		
		//Подпишемся на события::
		thisObj.DOMElement.addEventListener("submit", _formOnSubmit, false)
		
	}
}
Object.inherit(WAForm, ui.WAElement);
/* STATIC */

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAForm.prototype.microdataType = "onlifeschema.org/WAForm";


})(window);