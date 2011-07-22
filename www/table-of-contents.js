define([
  './slide-thumbnail',
  './slide'
], function (SlideThumbnail, slide) {

  function TableOfContents (args) {
    this.domNode = document.createElement('div');
    this._selected = null;
    this._slides = {};
    this.dojo = args.dojo;

    this._subscribe();
    this._listen();
  }

  TableOfContents.prototype._subscribe = function TOC_subscribe () {
    this.dojo.subscribe('/pragmatico/slide/new', this._addSlide.bind(this));
    this.dojo.subscribe('/pragmatico/slide/set', this._setSlide.bind(this));
    this.dojo.subscribe('/pragmatico/slide/delete', this._deleteSlide.bind(this));
  };

  TableOfContents.prototype._listen = function TOC_listen () {
    dojo.connect(this.domNode, 'onclick', this._onclick.bind(this));
  };

  TableOfContents.prototype._onclick = function TOC_onclick (event) {
    var el = event.target;
    while ( el && el !== this.domNode ) {
      if ( this.dojo.hasClass(el, 'slide-thumbnail') ) {
        event.preventDefault();
        this._select(el);
        break;
      }
      el = el.parentNode;
    }
  };

  TableOfContents.prototype._select = function TOC_select (el) {
    if ( this._selected === el ) {
      return;
    }
    this.dojo.publish('/pragmatico/select-slide',
                      [Number(el.getAttribute('data-slide-id'))]);
    if ( this._selected ) {
      this.dojo.removeClass(this._selected, 'selected-slide');
    }
    this._selected = el;
    this.dojo.addClass(el, 'selected-slide')
  };

  TableOfContents.prototype._addSlide = function TOC_addSlide (s) {
    console.log('TOC_addSlide');
    console.log(s);
    console.log(' ');
    var thumb = this._slides[slide.id(s)] = new SlideThumbnail(s);
    this.domNode.appendChild(thumb.domNode);
    if ( ! this._selected ) {
      this._select(thumb.domNode);
    }
  };

  TableOfContents.prototype._setSlide = function TOC_setSlide (s) {
    this._slides[slide.id(s)].refresh(s);
  };

  TableOfContents.prototype._deleteSlide = function TOC_deleteSlide (s) {
    this.domNode.removeChild(this._slides[slide.id(s)].domNode);
    delete this._slides[slide.id(s)];
  };

  return TableOfContents;

});