define([
  'coweb/main',
  './table-of-contents',
  './wysiwyg',
  'https://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js.uncompressed.js'
], function(coweb, TableOfContents, WYSIWYG) {

  dojo.require('dojo.data.ItemFileWriteStore');
  dojo.require('dijit.form.Button');
  dojo.require('dijit.layout.BorderContainer');
  dojo.require('dijit.layout.ContentPane');

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
      console.log('/pragmatico/slide/new');
      console.log([].slice.call(arguments));
      console.log(' ');
      dojo.publish('/pragmatico/slide/new', [].slice.call(arguments));
    });
    dojo.connect(dataStore, 'onSet', function () {
      console.log('/pragmatico/slide/set');
      console.log([].slice.call(arguments));
      console.log(' ');
      dojo.publish('/pragmatico/slide/set', [].slice.call(arguments));
    });
    dojo.connect(dataStore, 'onDelete', function () {
      console.log('/pragmatico/slide/delete');
      console.log([].slice.call(arguments));
      console.log(' ');
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

    // INITIALIZATION

    dataStore.newItem({
      id: generateId(),
      text: '# Welcome to *Pragmatico*\n\n'
        + '* Create beautiful presentations collaboratively in real time\n\n'
        + '* Simply use [`Markdown`](http://daringfireball.net/projects/markdown/)\n\n'
        + '* See results as you type'
    });

  });

});