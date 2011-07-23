define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideThumbnail (s, dojo) {
    this.domNode = document.createElement('div');
    this.thumbnail = document.createElement('div');
    this.slide = document.createElement('div');
    this.slide.className = 'slide';
    this.thumbnail.appendChild(this.slide);
    this.thumbnail.className = 'slide-thumbnail';
    this.domNode.appendChild(this.thumbnail);
    this.domNode.className = 'slide-thumbnail-container';
    this.domNode.setAttribute('data-slide-id', slide.id(s));
    this.dojo = dojo;
    this.slideObj = s;

    this._subscribe();
    this.refresh(s);
  }

  SlideThumbnail.prototype.refresh = function ST_refresh (s) {
    this.slide.innerHTML = markdown.toHTML(slide.text(s));
  };

  SlideThumbnail.prototype._subscribe = function ST_subscribe () {
    this.dojo.subscribe('/pragmatico/slide/set', this._onset.bind(this));
  };

  SlideThumbnail.prototype._onset = function ST_onset (s) {
    if ( slide.id(s) === slide.id(this.slideObj) ) {
      this.slideObj = s;
      this.refresh(s);
    }
  };

  return SlideThumbnail;

});
