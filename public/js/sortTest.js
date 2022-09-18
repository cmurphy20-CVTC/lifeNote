$(function(){

  const btn = $(".btnTest");
  const postId = $('#postId');

  btn.on("click", function(){
    console.log(postId.html());
  });
 
});