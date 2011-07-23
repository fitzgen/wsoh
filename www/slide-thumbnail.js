define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideThumbnail (s) {
    this.domNode = document.createElement('div');
    this.thumbnail = document.createElement('div');
    this.slide = document.createElement('div');
    this.slide.className = 'slide';
    this.thumbnail.appendChild(this.slide);
    this.thumbnail.className = 'slide-thumbnail';
    this.domNode.appendChild(this.thumbnail);
    this.domNode.className = 'slide-thumbnail-container';
    this.domNode.setAttribute('data-slide-id', slide.id(s));
    this.refresh(s);
  }

  SlideThumbnail.prototype.refresh = function ST_refresh (s) {
    this.slide.innerHTML = markdown.toHTML(slide.text(s));
  };

  return SlideThumbnail;

});
