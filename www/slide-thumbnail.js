define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideThumbnail (s, dojo) {
    this.domNode = document.createElement('div');
    this.innerDiv = document.createElement('div');
    this.innerDiv.className = 'slide';
    this.domNode.appendChild(this.innerDiv);
    this.domNode.className = 'slide-thumbnail-container';
    this.domNode.setAttribute('data-slide-id', slide.id(s));
    this.dojo = dojo;
    this.slide = s;

    this._subscribe();
    this.refresh(s);
  }

  SlideThumbnail.prototype.refresh = function ST_refresh (s) {
    this.innerDiv.innerHTML = markdown.toHTML(slide.text(s));
  };

  SlideThumbnail.prototype._subscribe = function ST_subscribe () {
    this.dojo.subscribe('/pragmatico/slide/set', this._onset.bind(this));
  };

  SlideThumbnail.prototype._onset = function ST_onset (s) {
    if ( slide.id(s) === slide.id(this.slide) ) {
      this.slide = s;
      this.refresh(s);
    }
  };

  return SlideThumbnail;

});
