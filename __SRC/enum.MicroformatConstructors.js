/*
 * @requared class.ui.WebApplication.js
 * @requared class.ui.WAElement.js
 * @requared class.ui.WATabs.js
 * @requared class.ui.WAMenu.js
 * @requared class.ui.WAForm.js
 * @requared class.ui.ImageGallery.js
 */

;(function(global) {//closure

var ui = global.ui;

/**
 * @enum {Function}
 */
global["MicroformatConstructors"] = {
	"onlifeschema.org/WebApplication" : ui["WebApplication"],
	"onlifeschema.org/WAElement" : ui["WAElement"],
	"onlifeschema.org/WATabs" : ui["WATabs"],
	"onlifeschema.org/WAMenu" : ui["WAMenu"],
	"onlifeschema.org/WAForm" : ui["WAForm"],
	"schema.org/ImageGallery" : ui["ImageGallery"]
}

})(window);