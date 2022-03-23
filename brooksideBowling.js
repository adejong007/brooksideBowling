'use strict';

/*
    Initialize websocket
*/

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

/*
    Lots of data storage for the game
*/
const names = ["Player 0","Player 1","Player 2","Player 3","Player 4"]
const scores = []
for (var i=1; i<=105; i++) {
    scores.push(0);
}

/*
    Connection and sending page
*/

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/bowlingGame.html');
});
/*
    Anything that gets sent to server, get passed on to everyone   
*/

io.on('connection', function(client) {
    console.log('Client connected on '+ Date() );
    client.on('join', function(data) {
        console.log(data);
    });
    
    client.on('frame', function(data) {
        console.log('Player '+data.id+' frame '+data.frame+' score '+data.score);
        var index = data.id*21 + (data.frame-1)*2 + (data.input-1);
        scores[index] = data.score;
        client.broadcast.emit('scores',scores);
    });

    client.on('start', function(data) {
        for (var i=0; i<5; i++) {names[i] = data[i]}
        for (var i=0; i<105; i++) {scores[i]=''}
        client.broadcast.emit('start', names);
    });

    client.on('restart', function() {
        client.broadcast.emit('restart');
    });
});


server.listen(4200);

