var osc = require('omgosc'),
    dgram = require('dgram');

var osc_serv = function(io, port) {
	var serv = new osc.UdpReceiver(port);
	io.sockets.on('connection', function (socket) {
	    osc_serv.on('', function(msg) {
	        socket.emit('osc', msg);
	    });
	});
};

module.exports.listen = osc_serv;