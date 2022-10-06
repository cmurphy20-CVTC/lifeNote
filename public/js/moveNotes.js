$(function() {

  $note = $('.note-container');

  $note.mouseenter(
    function() {
      $(this).stop(true, false)
      .animate({
        width: "85%"
      }, 250, 'linear');
    });
  
  $note.mouseleave(function() {
    $(this).stop(true, false)
    .animate({
        width: "75%"
      }, 250, "linear");
  });
});

