;(function(global) {//closure

var ui = global.ui = global.ui || {};

/**
 * @const
 * @enum {number}
 */
ui.EventTypes = {
	//Основные - имплементированы в class.ui.Element
	ON_SHOW : 0,
	ON_HIDE : 1,
	
	ON_POPUP_ON: 10,//Показывается при включении режима popup
	ON_POPUP_OFF: 11,//Показывается при выключении режима popup
	
	ON_EDIT_START : 20,//TODO
	ON_EDIT_END : 21,//TODO
	ON_EDIT_APPLY : 22,//TODO
	ON_EDIT_CANCEL : 23,//TODO
	
	ON_PART_SHOW : 30,//Показывается часть елемента: header, footer, data или left, right, center, или подобные
	ON_PART_HIDE : 31,//Скрывается часть елемента: --- // ---
	ON_CURRENT_CHILD_CHANGE : 32,
	
	
	ON_REGISTER_EVENT_CALLBACK : 40,
	
	ON_ERROR : 100
}

})(window);