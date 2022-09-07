var checkArea =  $(function() {

  $confirmTopic = $("#confirmTopic");
  $topicInput = $("#topicInput");

  content = $topicInput.val.trim();

  $confirmTopic.prop('disabled', true);

  if (!$topicInput.val() === '') {
    $confirmTopic.prop('disabled', false);
  }
 

  

  $(document).on('keyup', $topicInput, checkArea);

 
})