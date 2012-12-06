// # osc.io.js
// a client library used for accessing osc.io apis.

// `OscServer` is a backbone model responsible
// for listening for osc messages from on a specific port.
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

// `OscClient` is a backbone model responsible
// for broadcasting osc messages to a specific port and host.
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
		// first, we need to determine the type of argument(s)
		var typetag = '';
		var args = Array.prototype.slice.call(arguments, 1);
		var i;
		
		// TODO where is a function like this supposed to go in idiomatic backbone?
		var oscType = function( o ) {
			var t = typeof(o);
			if ( t === 'string' ) {
				return 's';
			} else if ( t === 'number' ) {
				if ( o === Math.floor(o)) {
					return 'i';
				} else {
					return 'f';
				}
			}
		}
		
		for ( i = 0; i < args.length; ++i ) {
			typetag += oscType(args[i]);
		}
		this.socket.emit('osc', {
			path: path,
			typetag: typetag,
			params: args
		});
	}

}, Backbone.Events);