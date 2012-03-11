;(function(global) {

/**
 * http://blog.getify.com/2010/02/howto-custom-error-types-in-javascript/
 * @constructor
 * @extends {Error}
 * @param {...} params error params
 */
var MicroformatError = global["MicroformatError"] = function(message) {
	var thisObj = (this === global) ? new MicroformatError.F() : this;
	
	MicroformatError["superclass"].constructor.apply(thisObj, arguments);//Do we realy need this ?
	
	thisObj.name = "MicroformatError";
    thisObj.message = (message || "");

	return thisObj;
}
Object.inherit(MicroformatError, Error)
/* STATIC */
/** @constructor */
MicroformatError.F = function(){}//default constructor if this === window

})(window);