export const Events = Object.freeze({
	Socket: Object.freeze({
		REGISTER: 'register',
		SUBSCRIBE: 'subscribe',
		OPEN: 'open',
		CLOSE: 'close',
	}),
	PAIR: 'pair',
	CONFIG: 'conf',
	PARAM_VALUE: 'param_value',
	PIN_VALUE: 'pin_value',
	PIN_SOURCE: 'pin_source',
	CONNECT: 'conn',
	DISCONNECT: 'dconn',
	PING: 'ping',
	PONG: 'pong',
	MESSAGE: 'msg',
	BROADCAST: 'event',
});

export const Services = Object.freeze({
	BACKEND: 'backend',
	FRONTEND: 'frontend',
	HEALTH_MONITOR: 'health_monitor',
	MQTT_BROKER: 'mqtt',
	SERIAL_LISTENER: 'serial-listener',
});

// module.exports = { Events, Services };
