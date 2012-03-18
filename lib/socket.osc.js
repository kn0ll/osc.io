var fs = require('fs'),
	osc = require('omgosc'),
    dgram = require('dgram'),
    colors = require('colors');

var Sock = function() {

};

// pretty colors
Sock.prototype.log = function(type, host, msg) {
	console.log('   ' + 'osc'.magenta + ' - ' + type + ' - ' + host + ' :: ' + JSON.stringify(msg));
};

// is user requesting client lib?
Sock.prototype.checkHttpRequest = function(req, cb) {
	if (req.url == '/socket.io/socket.osc.js') {
		fs.readFile(__dirname + '/../client/socket.osc.js', 'utf8', function(err, data) {
			cb(data);
		});
	} else {
		cb();
	}
};

// apply other http listeners if necessary
Sock.prototype.handleHttpRequest = function(req, res) {
	var _this = this;
	this.checkHttpRequest(req, function(data) {
		if (!data) {
			for (var i = 0, l = _this.oldListeners.length; i < l; i++) {
				_this.oldListeners[i].call(_this.httpServer, req, res);
			}
		} else {
			res.end(data);
		}
	});
};

// start proxying osc messages
Sock.prototype.listen = function(io, opts) {

	var _this = this;

	// handle http requests
	// so we can server the client library

	var httpServer = io.server,
		oldListeners = httpServer.listeners('request');

	_this.oldListeners = oldListeners;
	_this.server = httpServer;

  	httpServer.removeAllListeners('request');

	httpServer.on('request', function() {
		_this.handleHttpRequest.apply(_this, arguments);
	});

	// handle udp requests
	// so we can... send osc messages...

	io.sockets.on('connection', function (socket) {

		socket.on('osc:UdpReceiver', function(opts) {
			var server = new osc.UdpReceiver(opts.port);
			server.on('', function(msg) {
				try {
		    		socket.emit(opts.event_name, msg);
		    		_this.log('inbound'.green, opts.port.cyan, msg);
		    	} catch(e) {
		    		_this.log('inbound'.red, e);
		    	}
			});
		});

		socket.on('osc:UdpSender', function(opts) {
			var server = new osc.UdpSender(opts.host, opts.port);
			socket.on(opts.event_name, function(msg) {
				try {
		    		server.send(msg.path, msg.typetag, msg.params);
		    		_this.log('outbound'.green, (opts.host + ':' + opts.port).cyan, msg);
		    	} catch(e) {
		    		_this.log('outbound'.red, e);
		    	}
			});
		});

	});

};

module.exports = new Sock();