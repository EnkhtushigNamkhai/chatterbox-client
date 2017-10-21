// YOUR CODE HERE:
var app = {
  namesOfRooms: {}, 
  
  init: function () {
    app.handleSubmit();
    app.handleUsernameClick();
  }, 
  
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  

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
      // possible 'this' binding issue  
      url: this.server,
      type: 'GET',
      success: function (data) {
        var msgs = data.results;
        for (var i = 0; i < msgs.length; i++) {
          var obj = msgs[i];
          app.renderMessage(msgs[i]); 
          // if (!Object.keys(namesOfRooms).includes(msgs[i].roomname)) {
          //   namesOfRooms[msgs[i].roomname] = msgs[i].roomname; 
          //   app.renderRoom(msgs[i]); 
          // }
          //console.log(data.results);
        }
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
    var roomname = message.roomname;

        
    var $chatBox = $('<div class = "chatBox"><div>');
    var $text = $('<div class="messageText"><div>').text(message.text);
    var $username = $('<a class="person"><a>').text(message.username);
    $chatBox.append($username);
    $chatBox.append($text);
    $('#chats').append($chatBox); 
  }, 
  
  renderRoom: function(room) {
    $room = $('<div></div>').text(room);
    $('#roomSelect').append($room);
  },

  handleUsernameClick: function() {
  //should add a friend upon clicking the username

  },

  handleSubmit: function() {
    var userName = $('#userNameInput').val();
    var content = $('#contentInput').val();
    // alert(userName.toUpperCase() + 'says' + '\n' + content);
    
    //create the message object to pass into send(message)

    var message = {
      username: 'enki',
      text: 'trying to see what it fetches',
      roomname: '6thfloor'
    };
    //post request with userName and content
    console.log('send is getting called');
    app.send(message);
    app.fetch();
  }

}; 


$(document).ready(function() {
  app.init();
  app.fetch();
    

  $('#newPostSubmit').on('click', app.handleSubmit);


  // app.fetch();
  $('#createRoomButton').on('click', function() {
    //what to do when room 
    var room = $('#newRoomName');
    app.renderRoom(room);
  });
  
  
});


