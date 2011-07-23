define([
  './slide',
  './markdown.js'
], function (slide) {

  function SlideThumbnail (s) {
    this.domNode = document.createElement('div');
    this.innerDiv = document.createElement('div');
    this.innerDiv.className = 'slide';
    this.domNode.appendChild(this.innerDiv);
    this.domNode.className = 'slide-thumbnail-container';
    this.domNode.setAttribute('data-slide-id', slide.id(s));
    this.refresh(s);
  }

  SlideThumbnail.prototype.refresh = function ST_refresh (s) {
    this.innerDiv.innerHTML = markdown.toHTML(slide.text(s));
  };

  return SlideThumbnail;

});
