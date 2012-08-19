// # osc.io.js
// a nodejs middleware used for enabling osc
// messages to and from the browser with websockets.

var fs = require('fs'),
	osc = require('omgosc'),
	colors = require('colors');

function log() {
	var args = [].splice.call(arguments, 0),
		msg = ['osc.io'.green].concat(args);
	console.log.apply(console, msg);
}

// the middlware is responsible for forwarding all
// incoming/outgoing osc messages to/from socket.io.
module.exports = function(io) {


	// whenever a websocket connects to /osc/servers,
	// forward all inbound osc messages to that client.
	io
		.of('/osc/servers')
		.on('connection', function(socket) {

			socket.on('create', function(opts) {
				log('server'.magenta, 'created'.grey, '127.0.0.1:' + opts.port);
				var server = new osc.UdpReceiver(opts.port);

				server.on('', function(message) {
					log('server'.magenta, ('127.0.0.1:' + opts.port).grey, message.path, message.params);
					socket.emit('osc', message);
				});

				socket.on('disconnect', function() {
				});

			});

		});

	// whenever a websocket connects to /osc/clients,
	// forward all outbound osc messages from that client.
	io
		.of('/osc/clients')
		.on('connection', function(socket) {

			socket.on('create', function(opts) {
				log('client'.magenta, 'created'.grey, opts.host + ':' + opts.port);
				var client = new osc.UdpSender(opts.host, opts.port);

				socket.on('osc', function(message){
					log('client'.magenta, (opts.host + ':' + opts.port).grey, message.path, message.params);
					client.send(message.path, message.typetag, message.params);
				});

				socket.on('disconnect', function() {
				});

			});

		});

	// serve the client library.
	return function(req, res, next) {

		var matches;

		if (req.url.match('/osc.io/osc.io.js')) {
			fs.readFile(__dirname + '/../src/client/osc.io.js', 'utf8', function(err, file) {
				if (err) {
					res.writeHead(500);
					res.end();
				} else {
					res.writeHead(200);
					res.end(file);
				}
			});

		} else {
			next();
		}

	};

}