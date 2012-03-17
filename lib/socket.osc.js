var fs = require('fs'),
	osc = require('omgosc'),
    dgram = require('dgram'),
    colors = require('colors');

var Sock = function() {

};

// pretty colors
Sock.prototype.log = function(type, msg) {
	console.log('   ' + 'osc'.magenta + ' - ' + type + ' :: ' + JSON.stringify(msg));
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

	var inbound_server = new osc.UdpReceiver(opts.inbound_port),
		outbound_server = new osc.UdpSender(opts.outbound_host, opts.outbound_port);

	io.sockets.on('connection', function (socket) {

		// proxy inbound messages to web client
	    inbound_server.on('', function(msg) {
	    	try {
	    		socket.emit('osc', msg);
	    		_this.log('inbound'.green, msg);
	    	} catch(e) {
	    		_this.log('inbound'.red, e);
	    	}
	    });

	    // proxy outbound messages from web client
	    socket.on('osc', function(msg) {
	    	try {
	    		outbound_server.send(msg.path, msg.typetag, msg.params);
	    		_this.log('outbound'.green, msg);
	    	} catch(e) {
	    		_this.log('outbound'.red, e);
	    	}
	    });

	});

};

module.exports = new Sock();