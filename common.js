/**
 * If input is a string, gets the element whose ID is that string
 * else, returns the input (allowing to call with either the ID or
 * the element
 * @param elem ID string or element
 * @return Element related
 */
function $(elem) {
	var type=typeof(elem);
	if (type=="string") {
		return document.getElementById(elem);
	}
	return elem;
}

/**
 * Returns the array of direct children of given node who have
 * the given tag name. Only direct children returned
 * @param elem Base element
 * @param tag Tag name looked for (lowercase)
 * @return array of found elements
 */

function getChildrenByTagName(elem,tag) {
    elem=$(elem);
    tag=tag.toLowerCase();
    var ret=new Array();
    var idx=0;
    if (!elem.firstChild) {
	return ret;
    }

    elem=elem.firstChild;
    while (elem != null) {
	if (elem.nodeType == 1) {
	    if (elem.tagName.toLowerCase() == tag) {
		ret[idx++]=elem;
	    }
	}
	elem=elem.nextSibling;
    }
    return ret;
}

/**
 * Hides an element given either as parameter or through it's ID string
 * @param elem Element to hide
 * @return The hidden element
 */

function hide(elem) {
	var el=$(elem);

	if (!el.defdisplay) {
	    if ((el.style.display != 'none') && (el.style.display != 'block')) {
		el.defdisplay=el.style.display;
	    }
	}

	el.style.display='none';
	return el;
}

/**
 * Shows an element given either as parameter or through it's ID string
 * @param elem Element to show
 * @return The shown element
 */

function show(elem) {
	var el=$(elem);

	if ((el.style.display != '') && (el.style.display != 'none')) {
	    return el;
	}

	if (el.defdisplay) {
	    el.style.display=el.defdisplay;
	} else {
	el.style.display='block';
	}
	return el;
}

/** 
 * Shows an element if it's hidden, hide it if it's shown. the element is 
 * given either as parameter or through it's ID string
 * @param elem Element to toggle show
 * @return The shown element
 */

function toggle(elem) {
    var el=$(elem);
    if (el.style.display!="none") {
        hide(el);
    } else {
        show(el);
    }
    return el;
}


/** 
 * Clears a select given by element or by ID String
 * @param tag Select to clear
 */


function selectClear(tag) {
	var el=$(tag);
	while (el.length > 0) {
		el.remove(0);
	}
}

/**
 * Appends an option at the end of a select box. Last parameter (optional)
 * allows to make it pre-selected
 * @param tag select element or ID string of the select
 * @param text Textual content of the option (shown to the user)
 * @param value Value linked to the option (value attribute)
 * @param sel true if the item should be selected. (optional)
 */
function selectAppend(tag,text,value,sel) {
	var el=$(tag);
	sel=sel || false;
	var opt=document.createElement('option');
	opt.text=text;
	opt.value=value;
	if (sel) {
	    opt.selected=true;
	}
	try {
		el.add(opt,null);
	} catch (e) {
		el.add(opt); /* IE Bug */
	}
}

/**
 * Returns the value of the selected option in a <SELECT>. The value
 * returned is the content of the value attribute of the currently
 * selected option.
 * @param tag ID String of the select to read or element
 * @return Selected value or "" if nothing selected
 */

function selectGetValue(tag) {
    var el=$(tag);
    var idx=el.selectedIndex;
    if (el.options[idx]) {
	return el.options[idx].value;
    } else {
	return "";
    }
}
   
/**
 * Returns the textual content of the selected option in a <SELECT>.
 * @param tag ID String of the select to read or element
 * @return Selected option's text or "" if nothing selected
 */
function selectGetText(tag) {
    var el=$(tag);
    var idx=el.selectedIndex;
    if (el.options[idx]) {
	return el.options[idx].text;
    } else {
	return "";
    }
}
    
/**
 * Returns an XMLHttpRequest object. Uses different methods to accomodate
 * retarded (old MSIE) browsers which requires ActiveX.
 * @return XMLHttpRequest object or null
 */

function getXHR() {
	var xhr = null;
	try {
		xhr=new XMLHttpRequest();
	} catch (e) {
		try {
			xhr=new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e) {
			try {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
				xhr = null;
			}
		}
	}
	return xhr;
}

/**
 * Check that the request may be aborted (request in progress) then aborts it.
 * @param xhr The XMLHttpRequest object to be stopped
 */
function abortAJAX(xhr) {
	if (xhr != null && xhr.readyState != 0 && xhr.readyState != 4) {
		xhr.abort();
	}
}

/**
 * Returns the text in an element of a given name in the XML tree
 * given as argument. If any level has a problem, returns an empty string.
 * @param xml XML tree
 * @param tag XML Element to search
 * @return Text contained in the element or ""
 */
function getValFromXML(xml, tag) {
    if (xml) {
	var els=xml.getElementsByTagName(tag);
	if (els && els[0] && els[0].firstChild) {
	    return els[0].firstChild.nodeValue;
	}
    }
    return "";
}

/**
 * Creates a DOM element. If we are working in an XML Namespace, create it
 * in the correct namespace.
 * @param element Name of the element
 * @return The created element or false
 */

function createElement(element) {
	if (typeof document.createElementNS != 'undefined') {
		return document.createElementNS('http://www.w3.org/1999/xhtml', element);
	}
	if (typeof document.createElement != 'undefined') {
		return document.createElement(element);
	}
	return false;
}

/**
 * Polyfill for addEventListener and removeEventListener.
 * Le listener peut Ãªtre une fonction ou un objet disposant
 * d'un membre handleEvent(e).
 * Emule Ã©galement le DOMContentLoaded. L'objet event transmis
 * est corrigÃ© si nÃ©cessaire.
 */

(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (sera ignorÃ©) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (typeof listener.handleEvent != 'undefined') {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (sera ignorÃ©) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();

/**
 * Checks if value is a valid numeric value.
 * @param text Value to test
 * @return true if numeric, false else
 */

function isanumber(text) {
    var pattern = /^[-+]?[0-9]+(\.[0-9]+)?$/;
    if (text.match(pattern)==null) {
	return false
    }
    else {
	return true
    }
}

/**
 * Checks if value is a valid email
 * @param text Value to test
 * @return true if valid email, false else
 */

function checkEmail(string) {
    var regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // "Syntax Coloring fix
    if (!regexEmail.test(string)) {
	return false;
    } else {
	return true;
    }
}


/**
 * CSS object which holds CSS related functions
 * Use as a library, don't instanciate/copy
 */

var css = {

/**
 * css.getElementsByClass returns the array of sub elements
 * of the base element who have the given class active
 * @param node Base element
 * @param searchClass Required CSS class
 * @param tag Tag of the looked for elements
 * @return Array of the found elements
 */

    getElementsByClass : function(node, searchClass, tag) {

/* tag parameter is optionnal */
	tag = tag || '*';

	var classElements = new Array();
	var els = $(node).getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	
	for (var i = 0, j = 0; i < elsLen; i++) {
	    if (this.elementHasClass(els[i], searchClass) ) {
		classElements[j] = els[i];
		j++;
	    }
	}
	return classElements;
    },
    
    privateGetClassArray: function(el) {
	return el.className.split(' '); 
    },
    
    privateCreateClassString: function(classArray) {
	return classArray.join(' ');
    },
    
/**
 * css.hasClass allows to test if the given element has a specific
 * css class
 * @param el Element to test
 * @param classString CSS class to test
 * @return true if class present, false else
 */

    hasClass: function(el, classString) {
	el=$(el);
	if (!el) {
	    return false;
	}
	
	var regex = new RegExp('\\b'+classString+'\\b');
	if (el.className.match(regex)) {
	    return true;
	}
	
	return false;
    },
    
/**
 * css.addClass allows to add a CSS class to a given element.
 * Class is NOT duplicated
 * @param el Element to whom the class has to be added
 * @param classString Class to add
 */

    addClass: function(el,classString) {
	el=$(el);
	var classArray = this.privateGetClassArray(el);
	
	if (this.elementHasClass(el, classString)) {
	    return; // already has element so don't need to add it
	}
	
	classArray.push(classString);
	
	el.className = this.privateCreateClassString(classArray);
    },

/**
 * css.removeClass allows to remove a CSS class from a given element.
 * @param el Element from whom the class has to be removed
 * @param classString Class to remove
 */

    removeClass: function(el, classString) {
	el=$(el);
	var classArray = this.privateGetClassArray(el);
	
	for (x in classArray) {
	    if (classString == classArray[x]) {
		classArray[x] = '';
		break;
	    }
	}
	
	el.className = this.privateCreateClassString(classArray);	
    }
}

/**
 * The filter() method creates a new array with all elements that pass the test implemented 
 * by the provided function. This is a polyfill for browsers which don't have it
 * @param fun Test function. It will be called with arguments element, index, array and 
 *            should return true if the element has to be kept and false otherwise
 * @param thisArg (optional) Value to use as "this" when calling the filter function
 * @return Array with the kept elements
 */

if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun/*, thisArg*/) {
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				var val = t[i];
				if (fun.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}

		return res;
	};
}