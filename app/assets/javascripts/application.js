// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW
//
//= require_tree .
//= require_self

$(function() {

  var MAX_OFFSET = 1000;
  var MAX_IMAGES_COUNT = 10;
  var IMAGE_LOAD_INTERVAL = 2500
  var $imagesContainer = $('.images')
  var currentWidth = 0;
  var isMobile = $(window).width() <= 480;
  var imageThreshold = isMobile ? 2.5 : 1.25;

  function getImage() {
    var offset = Math.floor(Math.random() * MAX_OFFSET);

    $.getJSON('http://api.tumblr.com/v2/blog/mhgbrown.tumblr.com/likes?callback=?', {
      api_key: 'ok1dCktUCXTyOgG0vlyhxcW7oQ4lxUZl0QfZkoEiwwjvU2ZKAv',
      offset: offset,
      limit: 1
    }).then(function(json) {
      var $moodSetter = $('<img>');

      if(!json.response.liked_posts[0] || !json.response.liked_posts[0].photos || !json.response.liked_posts[0].photos.length) {
        console.warn('found post with no images!')
        return getImage();
      }

      var photos = json.response.liked_posts[0].photos;
      var rpindex = Math.floor(Math.random() * photos.length);

      $moodSetter.on('load', function(event) {
        var $images = $('img')

        $moodSetter.addClass('mood-setter');
        $imagesContainer.append($moodSetter);

        currentWidth += $(this).width()

        if (currentWidth > imageThreshold * $(window).width()) {
          currentWidth -= $images.first().width()
          $images.first().remove()
        }

        setTimeout(getImage, IMAGE_LOAD_INTERVAL);
      }).attr({
        src: photos[rpindex].original_size.url
      })
    });
  }

  $('.work').randomize()
  getImage();
});
