// const { BROKER_ADDR, DB_PORT } = require('./js/config');

// const MqttHandler = require('./js/MqttHandler');
import MqttHandler from './js/MqttHandler.js';
const mqttClient = new MqttHandler(['conf']);

// mqttClient.on('temp', async msg => {
// 	console.log('daaa');
// 	const arr = msg.split(':');

// 	const temperature = parseFloat(arr[0]);
// 	const humidity = parseFloat(arr[1]);
// 	const date = new Date(Date.now()).toLocaleString();

// 	console.log(`${temperature} ${humidity} ${date}`);

// 	try {
// 		const { _id, _rev, current: id } = await db.get('id');

// 		const res = await db.insert({ _id: `${id}`, temperature, humidity, date });
// 		if (!res.ok) {
// 			console.log('Something went wrong while inserting to database');
// 			return;
// 		}

// 		await db.insert({
// 			_id,
// 			_rev,
// 			current: id + 1,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

mqttClient.on(Events.CONFIG, macAddr => {
	// inputs
	// outputs
	// values
	// params
	if (socket.connected) {
		// for virtual agents we set the mac as <script name>-<id>
		const parts = macAddr.split('-');
		socket.emit(Events.BROADCAST, {
			event: Events.CONFIG,
			data: {
				mac: parts[0],
				id: parts[1],
			},
		});
	}
});

mqttClient.onPinValue((topic, value) => {
	const pinId = topic.replace('pin/', '');
	console.log(`got from topic [${topic}]: `, value);
	if (socket.connected) {
		socket.emit(Events.BROADCAST, {
			event: Events.PIN_VALUE,
			data: {
				id: pinId,
				value,
			},
		});
	}
});

mqttClient.connect();

import { io } from 'socket.io-client';
import { Events, Services } from './enums.js';
import { BROKER_ADDR } from './js/config.js';

console.log(`Broker addr: ${BROKER_ADDR}`);
const socket = io(BROKER_ADDR);

function register() {
	socket.emit(
		Events.Socket.REGISTER,
		Services.MQTT_BROKER,
		({ success, err }) => {
			if (!success) {
				console.log(`Could not register: `, err);
				console.log(`Retrying in 2 seconds`);
				return setTimeout(register, 2000);
			}
		}
	);
}

socket.on('connect', _ => {
	console.log('Socket connected!');
	register();
});

socket.on('connect_error', err => {
	console.log(`Could not connect due to `, err);
});

socket.on('conf', (conf, cb) => {
	if (conf == null) {
		console.log('Configuration is required, got null');
		return cb?.({ success: false, err: 'Configuration is required' });
	}
	mqttClient.sendData(`${conf.mac}`, JSON.stringify(conf.config));
	cb?.({ success: true });
});

socket.on(Events.PIN_VALUE, ({ id, value }) => {
	// socket.on(Events.PIN_VALUE, data => {
	// const { id, value } = JSON.parse(data);
	mqttClient.sendData(`pin/${id}`, value);
});

socket.on(Events.PIN_SOURCE, ({ id, src, value }) => {
	// socket.on(Events.PIN_SOURCE, data => {
	// 	const { id, src, value } = JSON.parse(data);
	mqttClient.sendData(`pin/${id}/src`, JSON.stringify({ id: src, value }));
});

socket.on(Events.PARAM_VALUE, ({ id, value }) => {
	// socket.on(Events.PARAM_VALUE, data => {
	// 	const { id, value } = JSON.parse(data);
	mqttClient.sendData(`param/${id}`, value);
});
