$(document).ready(function() {

  // if flash message exists, set timeout to fade out message after 5 seconds
  (function () {
    var checkForFlashMessage = $('.flashMessage').html();
    if (checkForFlashMessage) {
      setTimeout(function() {
        $('.flashMessage').fadeOut('slow');
      }, 5000);
    }
  })();

  /* Set the width of the side navigation to 250px */
  function openNav() {
      document.getElementById("mySidenav").style.width = "100%";
  };
  /* Set the width of the side navigation to 0 */
  function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
  };
  $('.sideNavButton').on('click', function() {
    openNav();
  });
  $('.closebtn').on('click', function() {
    closeNav();
  });

  $(function() {

    var $container = $('#grid');

    $container.imagesLoaded( function() {
      $container.masonry({
        itemSelector : '.masonryImage'
      });
    });

  });

  $('.grid-btn').on('click', function() {
    var linkId = $(this).val();
    $.post({
      url: "https://fcc-photo-share.herokuapp.com/likes/" + linkId,
      success: function(results) {
        $('#grid-item-likes' + results._id).html(results.likes);
        $('#item-likes' + results._id).html(results.likes);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('.masonryImage').on('click', function() {
    var linkId = $(this).attr('name');
    $.post({
      url: "https://fcc-photo-share.herokuapp.com/views/" + linkId,
      success: function(results) {
        $('#grid-item-views' + results._id).html(results.views);
        $('#item-views' + results._id).html(results.views);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('.grid-item-photo').on('error', function() {
    // display placeholder image if error
    $(this).attr('src', '/assets/missing.png');
  });

});
