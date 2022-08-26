$(function() {

  $composeForm = $("#composePost");
  $showForm = $("#showCompose");

  $composeForm.hide();

  $showForm.on("click", function() {
    $showForm.hide("fast", function(){
      $composeForm.show("slow", function(){

      })
    })
   
  })
})