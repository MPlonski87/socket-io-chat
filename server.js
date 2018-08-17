// Declare variables
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
users = [];
connections = [];

// Run server
server.listen(process.env.PORT || 3000);
console.log('Server is running...');

// Routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Connection
io.sockets.on('connection', function (socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnection
	socket.on('disconnect', function (data) {
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);		
	});
	
	// Send message
	socket.on('send message', function (data) {
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});	

	// New user
	socket.on('new user', function (data, callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	// Update user names
	function updateUsernames() {
		io.sockets.emit('get users', users);
	}
});
