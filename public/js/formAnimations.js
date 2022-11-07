$(document).ready(function() {

  // Animate for Contact Form
  $contactForm = $(".animateForm");

  $contactForm.hide().show(1500);

  // Animate for About and Features pages

  $featureP =$('.feature-paragraph > p');

  $featureP.css({
     opacity: 0,
  }).fadeTo( 1250, 1);

// Register and Login Froms

  $regLogForm = $('.regLogForm');

  $regLogForm.css({
    right: 1000,
    opacity: 0
  }).attr("justify-content", "center").animate({
    right: -10,
    opacity: 1
  }, 750);

});