var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(9001);

app.use("/common/styles",  express.static(__dirname + '/common/styles'));
app.use("/common/images",  express.static(__dirname + '/common/images'));
app.use("/common/scripts",  express.static(__dirname + '/common/scripts'));

app.get('/', function(req, res){
  res.sendFile("index.html", {"root": __dirname});
});

app.get('/mobile', function(req, res){
  res.sendFile("index-2.html", {"root": __dirname});
});

io.on('connection', function(socket){
	/*socket.on('chat message', function(msg){
		socket.broadcast.to(msg.from).emit('chat message', 'SERVER', msg.message);
		io.emit('updaterooms', msg.from, msg.message);

		console.log('chat message to ' + msg.from +', ' + msg.message);
	});*/

	socket.on('exitball', function(data) {
		console.log('ball exit: ' + data.from +', ' + data.to);
		//socket.broadcast.to(data.from).emit('chat message', 'SERVER', data.ball);
		io.emit('enterball', data.to, data.ball);
	});

	socket.on('join room', function(data) {
		socket.join(data.roomname);
  		console.log(data.username + ' joined game ' + data.roomname);

  		io.emit('playerEnter', data);
  	})
});

module.exports = app;