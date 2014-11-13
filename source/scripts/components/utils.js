/**
 *  Helper functions and utils that are used throughout the app
 *
 *  @module utils
 *  @author Alex Coady <alexcoady@stinkdigital.com>
 */


Element.prototype.addClass = function (string) {

  var classes = string.split(' '),
      classCount = classes.length;

  while ( classCount-- ) {

    if ( this.className.indexOf(classes[classCount]) === -1 ) {

      this.className += " " + classes[classCount];
    }
  }

  return this;
};


Element.prototype.removeClass = function (string) {

  var classes = string.split(' '),
      classCount = classes.length;

  while ( classCount-- ) {

    if ( this.className.indexOf(classes[classCount]) !== -1 ) {

      this.className = this.className.replace(" " + classes[classCount], '');
    }
  }

  return this;
};


Element.prototype.hasClass = function (string) {

  var count;

  if ( string instanceof Array ) {

    count = string.length;

    while ( count-- ) {

      if ( this.hasClass( string[count] ) ) {
        return true;
      }
    }
  }

  return this.className.indexOf(string) >= 0 ? true : false;
};


NodeList.prototype._updateClass = function (string, add) {

  var count = this.length;
  while (count--) {
    add ? this[count].addClass(string) : this[count].removeClass(string);
  }

  return this;
};


NodeList.prototype.addClass = function (string) {

  return this._updateClass( string, true )
};


NodeList.prototype.removeClass = function (string) {

  return this._updateClass( string, false )
};


/**
 *  Sets browser-compatible transform property inline
 *
 *  @method setTransform
 *  @param {String} value CSS3 transform value
 *  @return {Element} This element
 */
Element.prototype.setTransform = function ( value ) {

  if ( !value ) value = '';
    
  this.style.webkitTransform = value;
  this.style.MozTransform = value;
  this.style.msTransform = value;
  this.style.OTransform = value;
  this.style.transform = value;

  return this;
};


function preventDefault ( ev ) {

  var ev = ev || window.event;

  if (!ev) return;
  // -------------

  ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
}


var transitionend;
function getTransitionEnd () {
  
  var t,
      el = document.createElement('fakeelement'),
      transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      };

  if ( transitionend ) return transitionend;
  // ---------------------------------------

  for ( t in transitions ) {
    if ( el.style[t] !== undefined ) {
      transitionend = transitions[t];
      break;
    }
  }

  return transitionend;
}


function getPostId ( href ) {

  var postId;

  if ( href.indexOf('/post/') > -1 ) {

    postId = href.substring( href.indexOf('/post/') );
    postId = postId.substring( 6 );

    if ( postId.indexOf('/') > -1 ) {

      postId = postId.substring( 0, postId.indexOf('/') );
    }

    return postId;
  }

  return null;
}


function getWindowWidth () {

  var x = 0;
  
  if (self.innerWidth) {
    
    x = self.innerWidth;
  
  } else if (document.documentElement && document.documentElement.clientWidth) {
    
    x = document.documentElement.clientWidth;
  
  } else if (document.body) {
    
    x = document.body.clientWidth;
  }
  
  return x;
}

function getWindowHeight () {

  var y = 0;
  
  if (self.innerHeight) {
    
    y = self.innerHeight;
  
  } else if (document.documentElement && document.documentElement.clientHeight) {
    
    y = document.documentElement.clientHeight;
  
  } else if (document.body) {
    
    y = document.body.clientHeight;
  }
  
  return y;
}

function getFirstLine ( textOrEl ) {

  var text,
      firstLine,
      newLineIndex;

  if ( !textOrEl ) return null;
  // --------------------------

  if ( textOrEl instanceof Element ) {

    text = textOrEl.innerHTML;
  
  } else {

    text = textOrEl;
  }

  newLineIndex = text.indexOf('\n');

  if ( newLineIndex >= 0 ) {

    return text.substring( 0, newLineIndex );
  }

  return text;
}

function rangeFunc ( inputFrom, inputTo, outputFrom, outputTo ) {
  
  var range, domain, multiplier;
  
  range = {
    "difference": inputTo - inputFrom,
    "modifier": inputFrom * -1
  };

  domain = {
    "difference": outputTo - outputFrom,
    "modifier": outputFrom
  };

  multiplier = (domain.difference / range.difference);

  return function (value) {

    value += range.modifier;
    value = value * multiplier;
    value += domain.modifier;

    return value;
  }
}


function getOffset ( el ) {

  var bodyRect, elemRect, offset;

  bodyRect = document.body.getBoundingClientRect();
  elemRect = el.getBoundingClientRect();
  offset = {
    top: elemRect.top - bodyRect.top,
    left: elemRect.left - bodyRect.left
  };

  return offset;
}


module.exports = {
  preventDefault: preventDefault,
  getTransitionEnd: getTransitionEnd,
  getPostId: getPostId,
  getWindowWidth: getWindowWidth,
  getWindowHeight: getWindowHeight,
  getFirstLine: getFirstLine,
  rangeFunc: rangeFunc,
  getOffset: getOffset
};
