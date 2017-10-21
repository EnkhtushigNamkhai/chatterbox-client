// YOUR CODE HERE:
var friendList = [];
var roomNameList = [];
var currentRoom = 'Home';
var app = {
  namesOfRooms: {}, 
  
  init: function () {
    app.handleSubmit();
    console.log('calling handleUsernameClick');
    app.handleUsernameClick();
  }, 
  
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      // dataType: 'application/json',
      contentType: 'application/json',
      success: function (data) {

        console.log('chatterbox: Message sent', data);

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, 
  
  fetch: function(constraint = {order: '-updatedAt', limit: 50}) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // possible 'this' binding issue  
      url: this.server,
      type: 'GET',
      data: constraint,
// {order: '-updatedAt', limit: 50}

      success: function (data) {
        //only add the objects that we didn't have before.
        console.log(data);
        var msgs = data.results;
        for (var i = 0; i < msgs.length; i++) {
          var obj = msgs[i];
          app.renderMessage(msgs[i]);
        }
      },
      error: function (data) {
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
    if (!roomNameList.includes(roomname)) {
      roomNameList.push(roomname);
      $('.dropdown-content').append($('<a class = "roomSelected"></a>').text(roomname));
    }
    




    //store the roomnames
    //add the roomnames to an html element 
    var $chatBox = $('<div class = "chat"></div>');
    var $text = $('<p class="messageText"></p>').text(message.text);
    var $username = $('<a href = "#userNameClicked" class="person"></a>').text(message.username);
    var $friendIcon = $('<img src = "check.png" class = "friendIcon"></img>');
    
    if (friendList.includes(name)) {
      $username.text().css({'font-weight': 'bold'});
    }

    $chatBox.append($username);
    $chatBox.append($text);
    $chatBox.append($friendIcon);
    $('#chats').append($chatBox); 
  }, 
  
  renderRoom: function(room) {
    console.log('room');
    $room = $('<div></div>').text(room);
    $('#roomSelect').append($room);
  },

  /* Friends */
  handleUsernameClick: function() {

    $('body').on('click', '.chat', function() {
      var friendName = $(this).text();
//bold
      if (!friendList.includes(friendName)) {
        friendList.push(friendName);
        // updateFriends();
        $(this).css({'font-weight': 'bold'});
      }
      
      var $imageNode = $(this).find('.friendIcon');
      //add friendName to friendList

      // $(this).toggleClass();
      $imageNode.toggleClass('toggleFriend');
      
      
      //toggle class FriendToggle
    });
  },

  handleSubmit: function() {
    $('#newPostSubmit').on('click', function() {
      var userName = $('#userNameInput').val();
      var content = $('#contentInput').val();
      // alert(userName.toUpperCase() + 'says' + '\n' + content);
      
      //create the message object to pass into send(message)

      var message = {
        username: userName,
        text: content,
        roomname: currentRoom
      };
      
      //post request with userName and content
      console.log('send is getting called', JSON.stringify(message));
      app.send(JSON.stringify(message));
      app.fetch();
    }); 
  }
}; 


$(document).ready(function() {
  console.log('init called');
  app.init();
  // setInterval(function() {
  //   app.fetch();
  // }, 3000);
  app.fetch();
 
  

  // app.fetch();
  $('#createRoomButton').on('click', function() {
    //what to do when room 
    var room = $('#newRoomName').val();
    
    //send a post request
    var message = {
      username: '',
      text: 'created a new Room: ' + room,
      roomname: room
    };
    app.send(JSON.stringify(message));
    app.renderRoom(JSON.stringify(room));
  });

  $('.dropdown').on('click', '.roomSelected', function() {
    console.log(this);
    var myRoom = $(this).text();
    currentRoom = myRoom;
   
    //clear the chat
    app.clearMessages();
    constraint = {"where": {"roomname": currentRoom}};
    
    app.fetch(constraint);

    //get request with only roomname as parameter
    
  });
  
  
});


