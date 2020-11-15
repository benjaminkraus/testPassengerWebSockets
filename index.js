var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const WebSocket = require("ws");
var wss = expressWs.getWss();
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    }
  });
}

app.ws('/', (ws, req) => {
  ws.on("message", json => {
      var messageIn = JSON.parse(json);
      var messageOut;
      if (messageIn.username) {
          ws.username = messageIn.username;
          messageOut = {
              is_online: '🔵 <i>' + ws.username + ' join the chat..</i>'
          };
      }
      if (messageIn.chat_message) {
          messageOut = {
              chat_message: '<strong>' + ws.username + '</strong>: ' + messageIn.chat_message
          };
      }
      broadcast(messageOut)
  });
  
  ws.on("close", (code, reason) => {
      messageOut = {
          is_online: '🔴 <i>' + ws.username + ' left the chat..</i>'
      };
      broadcast(messageOut)
  });
});

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.listen(8080, function() {
    console.log('listening on *:8080');
});
