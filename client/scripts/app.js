var app = {
  roomHash: {}, 
  messages: [],
  lastMessageId: 0,
  userName: 'anon',
  currentRoom: 'Home',
  friendObj: {},

  
  init: function () {
    var arr = window.location.search.split("=");
    app.userName = arr[1];
    console.log('calling fetch');
    app.fetch();

    
    $('#createRoomButton').on('click', app.handleNewRoom);
    $('#newPostSubmit').on('click', app.handleSubmit);
    $('.dropdown').on('click', '.roomSelected', app.handleRoomChange);
    $('#chats').on('click', '.person', app.handleUsernameClick);

    setInterval(function() {
      app.fetch();
    }, 4000); 
  }, 
  
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',  

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, 
  
  fetch: function(constraint = {order: '-createdAt', limit: 20}) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: constraint,
      success: function (data) {

        if (!data.results || !data.results.length) { return; }
        app.messages = data.results;

        //get the limit number data, and get the available rooms.
        app.messages.forEach(function(message) {
          app.checkRoom(message);
        });

         //filter message so that only the room the user is in gets displayed
        var messages = app.messages.filter(function(message) {
          if (app.currentRoom === 'Home' && !message.roomname) {
            return true;
          } else if (app.currentRoom === message.roomname) {
            return true;
          } else {
            return false;
          }
        });

        app.renderMessages(messages);
        app.scrollToBottom();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  renderMessages: function(messages) {
    // messages = messages.filter(function(message) {
    //   if (app.currentRoom === 'Home' && !message.roomname) {
    //     return true;
    //   } else if (app.currentRoom === message.roomname) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });

    //if current room's chat is empty/ previous chats expired.
    if (messages.length === 0) {
      console.log("empty");
      //display some sort of the previous chats have expired message?
      return;
    }

    var mostRecentMessage = messages[0];
    //if mostRecentMessage.objectId is same as lastMessageId return
    if (app.lastMessageId === mostRecentMessage.objectId) {
      console.log('returning');
      return;
    }
    

    var found = false;
    console.log(app.lastMessageId);
    for (var i = messages.length - 1; i >= 0; i--) {
      if (app.lastMessageId === 0) {
        // lastMessageId is not yet initialized
        found = true;
      } else if (app.lastMessageId === messages[i].objectId) {
        //if you found the prev Object
        console.log("found prev obj");
        found = true;
        continue;
      }
      if (found) {
        app.renderMessage(messages[i]);
      }
    }
    
    //if you didn't find the last object in the messages, can just render all the messages
    //maybe make this another function 
    if (!found) {
      app.handleLastObjNotFound(messages);
    }

    app.lastMessageId = mostRecentMessage.objectId;
  },

  handleLastObjNotFound: function(messages) {
    app.clearMessages();
      for (var i = messages.length - 1; i >= 0; i--) {
        app.renderMessage(messages[i]);
    }
  },
  
  renderMessage: function(message) {
    var name = message.username; 
    
    var $chatBox = $('<div class = "chat"></div>');
    var $text = $('<p class="messageText"></p>').text(message.text);
    var $username = $('<h3 class="person"></h3>').text(message.username);
    var $friendIcon = $('<img src = "check.png" class = "friendIcon"></img>');
    

    $chatBox.append($username);
    $chatBox.append($text);
    $chatBox.append($friendIcon);
    $('#chats').append($chatBox); 
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  /** User posts a content **/
  handleSubmit: function() {
    var content = $('#contentInput').val();
    var post = {
      username: app.userName,
      text: content,
      roomname: app.currentRoom,
    };

    app.send(JSON.stringify(post));
    //empty the text field so user doesn't have to erase it.
    $('#contentInput').val('');
    app.scrollToBottom();

  },

  /** Check if the current room needs to be added to drop down or not**/
  checkRoom: function(message) {
    var roomname = message.roomname;

    if (!app.roomHash[roomname]) {
      //if room not in the app.roomHash, add it
      app.roomHash[roomname] = true;
      //render the room to the drop down
      app.renderRoom(roomname);
    }
  },

  /** Adds the roomname to the dropDown menu **/
  renderRoom: function(roomname) {
    $('.dropdown-content').append($('<a class = "roomSelected"></a>').text(roomname));
  },

  /** User selects a different room **/
  handleRoomChange: function() {
    var newRoomName = $(this).text();
    //set current room to be the selected room so when we post, only people in our room can see
    app.currentRoom = newRoomName;
    // //clear the chat
    app.clearMessages();
    app.lastMessageId = 0;
    app.fetch();
    app.scrollToBottom();
  },

  /** Creates a new room **/
  handleNewRoom: function() {
    var newRoomName = $('#newRoomName').val();
    var message = {
      username: '',
      text: app.userName +' created a new Room: ' + newRoomName,
      roomname: newRoomName
    };
    app.currentRoom = newRoomName;
    app.clearMessages();
    app.lastMessageId = 0;
    app.send(JSON.stringify(message));
    $('#newRoomName').val('');
  },

  /** When a username is clicked, must add friend **/
  handleUsernameClick: function() {
    var friendUserName = $(this).text();
    console.log(friendUserName);
    //add them to the friend list on the side
    //some code here 
  },

  scrollToBottom: function() {
    $("#chats").animate({ scrollTop: $(document).height() }, "slow");
  }

  // /* Friends */
  // handleUsernameClick: function() {
  //   $('body').on('click', '.chat', function() {
  //     var friendName = $(this).find('.person').text();
  //     if (!friendList.includes(friendName)) {
  //       friendList.push(friendName);
  //       var $friendNode = $('<li></li>').text(friendName);
  //       $('.friendList').append($friendNode);
  //     }
  //     //makes all previous instances bold?
  //     // updateFriends();

  //       // $(this).css({'font-weight': 'bold'});
  //     // var $imageNode = $(this).find('.friendIcon');
  //     // $imageNode.toggleClass('toggleFriend');
  //     //add friendName to friendList
  //     // $(this).toggleClass();
  //   });
  // },
}; 


$(document).ready(function() {
// myPanel[0].scrollHeight - myPanel.height()
  // $('#chats').animate({scrollTop: ($("#chats")[0].scrollHeight - $("#chats").height())}, 0);
  console.log("calling init");
  app.init();
  $("#chats").scrollTop($('#chats').height())
  // var out = $('#chats');

    // setInterval(function() {
    //   // allow 1px inaccuracy by adding 1
    //   var isScrolledToBottom = out[0].scrollHeight - out[0].clientHeight <= out.scrollTop() + 1;
    //   if(isScrolledToBottom)
    //     out.scrollTop = out[0].scrollHeight - out[0].clientHeight;
    // }, 1000);
});




