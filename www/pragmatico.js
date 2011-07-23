define([
  'coweb/main',
  './table-of-contents',
  './wysiwyg',
  './slide-show',
  './collab',
  'https://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js.uncompressed.js'
], function(coweb, TableOfContents, WYSIWYG, SlideShow, Collab) {

  dojo.require('dojo.data.ItemFileWriteStore');
  dojo.require('dijit.form.Button');
  dojo.require('dijit.layout.BorderContainer');
  dojo.require('dijit.layout.ContentPane');

  dojo.publish = (function (publish) {
    return function (topic) {
      console.log('Publishing to ' + topic);
      console.log([].slice.call(arguments, 1));
      console.log(' ');
      publish.apply(this, [].slice.call(arguments));
    };
  }(dojo.publish));

  dojo.ready(function() {


    // PARSE

    dojo.parser.parse();


    // DATA

    var emptyData = {
      identifier: 'id',
      items: []
    };

    var dataStore = new dojo.data.ItemFileWriteStore({ data: emptyData });

    dojo.connect(dataStore, 'onNew', function () {
      dojo.publish('/pragmatico/slide/new', [].slice.call(arguments));
    });
    dojo.connect(dataStore, 'onSet', function () {
      console.log('A VALUE HAS BEEN SET');
      dojo.publish('/pragmatico/slide/set', [].slice.call(arguments));
    });
    dojo.connect(dataStore, 'onDelete', function () {
      dojo.publish('/pragmatico/slide/delete', [].slice.call(arguments));
    });


    // WIDGETS

    var wysiwyg = new WYSIWYG({
      dojo: dojo,
      textarea: dojo.byId('edit-textarea'),
      preview: dojo.byId('preview'),
      dataStore: dataStore
    });

    var toc = new TableOfContents({
      dojo: dojo
    });
    dijit.byId('toc').domNode.appendChild(toc.domNode);

    var addSlideButton = dijit.byId('add-slide-button');
    // var removeSlideButton = dijit.byId('remove-slide-button');

    function generateId () {
      return (+new Date()) + Math.round(Math.random() * 1000);
    }

    dojo.connect(addSlideButton, 'onClick', function () {
      dataStore.newItem({
        id: generateId(),
        text: '# New Slide\n\n'
          + '* Item one\n\n'
          + '* Item two'
      });
    });

    // dojo.connect(removeSlideButton, 'onClick', function () {
    // });

    var slideShowButton = dijit.byId('slideshow-button');
    console.log(slideShowButton);

    var slideShow = new SlideShow({
      dojo: dojo
    });
    document.body.appendChild(slideShow.domNode);

    dojo.connect(slideShowButton, 'onClick', function () {
      dataStore.fetch({
        onComplete: function (slides) {
          dojo.publish('/pragmatico/slide-show/start', [slides]);
        }
      });
    });


    // Hide/show main border container

    var container = dijit.byId('container');
    dojo.subscribe('/pragmatico/slide-show/start', function () {
      dojo.style(container.domNode, "display", "none");
    });
    dojo.subscribe('/pragmatico/slide-show/stop', function () {
      dojo.style(container.domNode, "display", "block");
    });


    // COLLAB SETUP

    console.log(Collab);

    var collab = new Collab({
      dataStore: dataStore,
      coweb: coweb,
      dojo: dojo,
      id: prompt('Slide show id:')
    });

    // INITIALIZATION

    dataStore.newItem({
      id: 1,
      text: '# Welcome to *Pragmatico!*\n\n'
        + '* Create beautiful presentations collaboratively in real time\n\n'
        + '* Simply use [`Markdown`](http://daringfireball.net/projects/markdown/)\n\n'
        + '* See results as you type\n'
        + '* All in your favorite browser: ![Firefox !!!!!](http://people.mozilla.com/~faaborg/files/shiretoko/firefoxIcon/firefox-64.png)'
    });

  });

});
