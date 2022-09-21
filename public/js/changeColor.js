$(function() {

  let preview = $("#previewBtn");

  let nav = $(".navbar");
  let footer = $(".footer");



  preview.on("click", function(){
    
    nav.css("background-color", "#FF3131");
    footer.css("background-color", "#FF3131");

  });
 

    // let colors = $(".profileColors");
    
    // for( let numColors = 0; numColors < colors.length; numColors ++) {
    //   numColors += 1;
    //   console.log(numColors);
    // }


  
})