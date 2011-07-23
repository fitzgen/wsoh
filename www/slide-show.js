define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideShow (args) {
    this.dojo = args.dojo;
    this.active = false;
    this.slides = null;
    this.index = 0;
    this.domNode = document.createElement('div');
    this.domNode.id = 'slideshow';
    this.domNode.tabIndex = -1;
    this.domNode.focus();
    this.slideDiv = this.dojo.create('div', { className: 'slide' }, this.domNode);

    this._show();
    this._listen();
    this._hide();
    this._subscribe();
  }

  SlideShow.prototype._hide = function SS_hide () {
    this.active = false;
    this.dojo.style(this.domNode, 'display', 'none');
  };

  SlideShow.prototype._show = function SS_show () {
    this.active = true;
    this.dojo.style(this.domNode, 'display', 'block');
    this.domNode.focus();
  };

  SlideShow.prototype._subscribe = function SS_subscribe () {
    this.dojo.subscribe('/pragmatico/slide-show/start', this._onstart.bind(this));
    this.dojo.subscribe('/pragmatico/slide-show/stop', this._onstop.bind(this));
  };

  SlideShow.prototype._onstart = function SS_onstart (slides) {
    this.slides = slides;
    this.index = 0;
    this.active = true;

    this._show();
    this._onresize();
    this._showSlide();
  };

  SlideShow.prototype._showSlide = function SS_showSlide () {
    console.log('SHOWING SLIDE');
    this.slideDiv.innerHTML = markdown.toHTML(slide.text(this.slides[this.index]));
  };

  SlideShow.prototype._onstop = function SS_onstop () {
    this.active = false;
    this._hide();
  };

  SlideShow.prototype._onresize = function SS_onresize () {
    if (this.active) {
        this.slideDiv.style.MozTransformOrigin = "0% 0%";
        this.slideDiv.style.MozTransform = "scale("+(window.innerWidth/800)+")";
    }
  };

  var ESC = 27;
  var SPC = 32;
  var UP = 38;
  var DOWN = 40;
  var LEFT = 37;
  var RIGHT = 39;

  SlideShow.prototype._listen = function SS_listen () {
    var next = this._next.bind(this);
    var previous = this._previous.bind(this);

    this.dojo.connect(window, 'onresize', this._onresize.bind(this));

    this.dojo.connect(this.domNode, 'onClick', next);
    this.dojo.connect(this.domNode, 'onkeypress', (function (event) {
      if ( this.active ) {
        switch (event.keyCode) {
        case ESC:
          this.dojo.publish('/pragmatico/slide-show/stop');
          break;

        case UP:
        case LEFT:
          previous();
          break;

        case DOWN:
        case SPC:
        case RIGHT:
          next();
          break;

        default:
          break;
        }
      }
    }).bind(this));
  };

  SlideShow.prototype._next = function SS_next () {
    if ( this.index+1 < this.slides.length ) {
      this.index++;
    }
    this._showSlide();
  };

  SlideShow.prototype._previous = function SS_previous () {
    if ( this.index-1 >= 0 ) {
      this.index--;
    }
    this._showSlide();
  };

  return SlideShow;

});
