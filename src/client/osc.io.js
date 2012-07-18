/*

osc server
var server = new OscServer({ port: 8080, host: '127.0.0.1' });
server.on('osc', function(msg) { console.log(msg.path, msg.params); });
server.on('/specific/path', function(params) { console.log(params); });

*/

var OscServer = Backbone.Model.extend({

	urlRoot: '/osc/servers',

	defaults: {
		port: 8000
	},

	// when the model is created, we start
	// listening for and broacasting midi events
	initialize: function() {
		var socket = io.connect(this.url());
		socket.emit('create', {
			port: this.get('port')
		})
		socket.on('osc', _.bind(this.sendOsc, this));
	},

	sendOsc: function(msg) {
		this.trigger('osc', msg);
		this.trigger(msg.path, msg.params);
	}

}, Backbone.Events);

/*

osc client
var client = new OscClient({ port: 8080 });
server.on('osc', function(msg) { console.log(msg); });

*/

var OscClient = Backbone.Model.extend({

	urlRoot: '/osc/clients',

	defaults: {
		port: 8000,
		host: '127.0.0.1'
	},

	// when the model is created, we start
	// listening for and broacasting midi events
	initialize: function() {
		var socket = io.connect(this.url());
		socket.emit('create', {
			port: this.get('port'),
			host: this.get('host')
		})
		this.on('osc', _.bind(this.sendOsc, this));
		this.socket = socket;
	},

	sendOsc: function(path, param) {
		this.socket.emit('osc', {
			path: path,
			typetag: 'f',
			params: [param]
		});
	}

}, Backbone.Events);