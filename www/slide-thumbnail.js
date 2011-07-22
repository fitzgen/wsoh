define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideThumbnail (s) {
    this.domNode = document.createElement('div');
    this.domNode.className = 'slide-thumbnail';
    this.domNode.setAttribute('data-slide-id', slide.id(s));
    this.refresh(s);
  }

  SlideThumbnail.prototype.refresh = function ST_refresh (s) {
    this.domNode.innerHTML = markdown.toHTML(slide.text(s));
  };

  return SlideThumbnail;

});