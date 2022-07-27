$(function() {

  $blue = $("#forBlue");
  $red = $("#forRed");
  $default = $("#forDefault");
  $purple = $("#forPurple");

  $red.on("click", function() {
    $(".footer").css("background-color",  "#C70039");

    $(".navbar").css("background-color", "#C70039")
  })

  $blue.on("click", function() {
    $(".footer").css("background-color",  "#0000FF ");

    $(".navbar").css("background-color", "#0000FF")
  })

  $purple.on("click", function() {
    $(".footer").css("background-color",  "#8F00FF ");

    $(".navbar").css("background-color", "#8F00FF")
  })

  $default.on("click", function() {
    $(".footer").css("background-color",  "#65d842");

    $(".navbar").css("background-color", "#65d842")
  })

})