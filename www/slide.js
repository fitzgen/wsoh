define(function () {

  function isArray (it) {
    return Object.prototype.toString.call(it) === '[object Array]';
  }

  return {

    id: function (slide) {
      return isArray(slide.id)
        ? slide.id[0]
        : slide.id;
    },

    text: function (slide) {
      return isArray(slide.text)
        ? slide.text[0]
        : slide.text;
    }

  };

});