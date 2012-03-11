
;(function(global) {

//Exports START
(global["exports"] || (global["exports"] = {}))
	["app"] = test1;
//Exports END

function test1(settings) {
	var thisObj = this;
	
/* PUBLICK */
	/** @type {Node} main DOM container */
	thisObj.DOMElement;
	
	thisObj.init = function(DOMElement) {
		thisObj.DOMElement = DOMElement;
		console.log("test1 | ", "settings : ", settings, "DOMElement : ", DOMElement);
	}
}
	
})(window);