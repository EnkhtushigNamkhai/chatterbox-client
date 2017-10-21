// YOUR CODE HERE:
var app = {
  init: function () {
  }, 
  
  server: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',  

  send: function(message) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, 
  
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
    
  },
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    var name = message.username; 
    var $text = $('<span class="messageText"><span>').text(message.text);
    var roomname = message.roomname;
    var $chatBox = $('<div><div>').addClass('chatBox');
    var $username = $('<a class="person"><a>').text(message.username);
    $chatBox.append($username).append($text);
    $('#chats').prepend($chatBox);
        
  }, 
  
  renderRoom: function(room) {

  }
}; 

$(document).ready(function() {
  app.init();


  $('#newPostSubmit').on('click', function() {
    var userName = $('#userNameInput').val();
    var content = $('#contentInput').val();
    alert(userName.toUpperCase() + 'says' + '\n' + content);

    //post request with userName and content
  });
});
