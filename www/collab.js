define([
  './slide'
], function (slide) {

  function Collab (args) {
    this.dataStore = args.dataStore;
    this.coweb = args.coweb;
    this.dojo = args.dojo;
    this.mutex = false;

    this._prepSession();
    this._prepCollab(args.id);
    this._subscribe();
  }

  Collab.prototype._prepSession = function Collab_prepSession () {
    this.session = this.coweb.initSession();
    this.session.onStatusChange = function(status) {
      console.debug(status);
    };
    this.session.prepare();
  };

  Collab.prototype._prepCollab = function Collab_prepCollab (id) {
    this.collab = this.coweb.initCollab({
      id: id
    });
  };

  Collab.prototype._subscribe = function Collab_subscribe () {
    this.dojo.subscribe('/pragmatico/slide/new', this._onNewLocalSlide.bind(this));
    this.dojo.subscribe('/pragmatico/slide/set', this._onSetLocalSlide.bind(this));
    // this.dojo.subscribe('/pragmatico/slide/delete', this._onDeleteLocalSlide.bind(this));

    this.collab.subscribeSync('change.slide.*', this._onRemoteSlideChange.bind(this));
  };

  Collab.prototype._onNewLocalSlide = function Collab_onNewLocalSlide (s) {
    if ( ! this.mutex ) {
      this.collab.sendSync('change.slide.' + slide.id(s), {
        text: slide.text(s)
      }, 'insert');
    }
  };

  Collab.prototype._onSetLocalSlide = function Collab_onSetLocalSlide (s) {
    if ( ! this.mutex ) {
      this.collab.sendSync('change.slide.' + slide.id(s), {
        text: slide.text(s)
      }, 'update');
    }
  };

  Collab.prototype._onRemoteSlideChange = function Collab_onRemoteSlideChange (args) {
    var id = args.name.split('.')[2];
    var value = args.value;
    var type = args.type;

    console.log('REMOTE CHANGE');
    console.log(id, value.text, type);
    console.log(' ');

    this.mutex = true;
    if ( args.type === 'update' ) {
      this.dataStore.fetchItemByIdentity({
        identity: id,
        onComplete: (function (s) {
          this.dataStore.setValue(s, 'text', slide.text(s));
          this.mutex = false;
        }).bind(this)
      });
    } else if ( args.type === 'insert' ) {
      this.dataStore.newItem({
        id: id,
        text: value.text
      });
    this.mutex = false;
    }
    // delete
  };

  return Collab;

});
