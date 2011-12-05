/**
 * @requared ui.WAElement
 */

;(function(global) {//closure

var ui = global.ui;

/**
 * Класс описывающий поведение контейнера табов
 * Microdata type - onlifeschema.org/WAForm
 * @constructor
 * @extends {ui.WAElement}
 * @param {...} _params Params list the same as in ui.WAElement
 */
var WAForm = ui.WAForm = function (_params) {
	var thisObj = this;
	//Наследуем свойства родительского класса
	WAForm.superclass.constructor.apply(thisObj, arguments);
	
/* PRIVATE */
	function _formOnSubmit (event) {
		var form = event.target,
			action = form.action,
			params = action.split("?");//TODO:: правильно обрабатывать строку вида http://examle.com?param1=value1&param2=?&param3... <-- 2 раза знак "?"
		
		//action - строка в формате paramName1={[inputName1]}&paramName2={[inputName2]}&...
		params = params.replace(/\{\[(.*?)\]\}/gi, function(str, p1) {
			if(form[p1])return form[p1].value;
			else "";
		})
		if(global.DEBUG)console.log(action + "?" + params);
		//TODO:: Отправляем данные
		
		//Предотвращяем всплытие события, для того, чтобы контейнер не получал ложного срабатывания
		event.stopPropagation();
		event.preventDefault();
		return false;
	}
	
	
/* PUBLIC */
	/** Формы. {Array.<FormElement>} */
	thisObj.forms = null;
	

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

		thisObj.forms = $A(thisObj.properties["form"]);
		
		thisObj.forms.forEach(function(form){
			form.onsubmit = _formOnSubmit;
		});
		
		//Подпишемся на события::
		//Сообщения об изменеии thisObj.DOMElement.currentTab
		thisObj.DOMElement.addEventListener("submit", _formOnSubmit)
		
	}
}
inherit(WAForm, ui.WAElement);
/* STATIC */

/* PROTOTYPE */
/**
 * Тип разметки по микроформату или микродате
 * @type {string}
 */
WAForm.prototype.microdataType = "onlifeschema.org/WAForm";


})(window);