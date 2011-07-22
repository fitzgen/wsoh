define([
  './slide',
  './markdown.js'
], function (slide) {

  function WYSIWYG (args) {
    this.dojo = args.dojo;
    this.textarea = args.textarea;
    this.preview = args.preview;
    this.dataStore = args.dataStore;
    this.slide = null;

    this._subscribe();
    this._listen();
  }

  WYSIWYG.prototype._subscribe = function WYSIWYG_subscribe () {
    this.dojo.subscribe('/pragmatico/select-slide', this._onselect.bind(this));
    this.dojo.subscribe('/pragmatico/slide/set', this._onset.bind(this));
  };

  WYSIWYG.prototype._onselect = function WYSIWYG_onselect (id) {
    this.textarea.value = '';
    this.preview.innerHTML = '';

    this.dataStore.fetchItemByIdentity({
      identity: id,
      onItem: (function (s) {
        this.slide = s;
        this.textarea.value = slide.text(s);
        this.preview.innerHTML = markdown.toHTML(slide.text(s));
      }).bind(this)
    });
  };

  WYSIWYG.prototype._onset = function WYSIWYG_onset (s) {
    if ( slide.id(s) === slide.id(this.slide) ) {
      this.preview.innerHTML = markdown.toHTML(slide.text(s));
    }
  };

  WYSIWYG.prototype._listen = function WYSIWYG_listen () {
    this.dojo.connect(this.textare, 'onkeyup', this._onkeyup.bind(this));
  };

  WYSIWYG.prototype._onkeyup = function WYSIWYG_onkeyup (event) {
    this.dataStore.setValue(this.slide, 'text', this.textarea.value);
  };

  return WYSIWYG;

});