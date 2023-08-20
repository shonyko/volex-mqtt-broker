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

mqttClient.on('conf', async macAddr => {
	// inputs
	// outputs
	// values
	// params
	if (socket.connected) {
		socket.emit('event', {
			event: Events.CONFIG,
			data: {
				mac: macAddr,
			},
		});
	}
});

mqttClient.onPinValue((topic, value) => {
	const pinId = topic.replace('pin/', '');
	if (socket.connected) {
		socket.emit('event', {
			event: Events.PIN_VALUE,
			data: {
				id: pinId,
				value: value,
			},
		});
	}
});

mqttClient.connect();

import { io } from 'socket.io-client';
import { Events, Services } from './enums.js';

const broker_addr = process.env.BROKER ?? 'localhost:3000';
console.log(`BROker addr: ${broker_addr}`);
const socket = io(`ws://${broker_addr}`);

function register() {
	socket.emit(
		Events.Socket.REGISTER,
		Services.MQTT_BROKER,
		({ success, err }) => {
			if (!success) {
				console.log(`Could not register: ${err}`);
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

function onConfigReceived(data, _) {
	mqttClient.sendData(`${data.mac}`, data.config);
}

const cmdHandlers = new Map();
cmdHandlers.set('conf', onConfigReceived);

socket.on('msg', ({ cmd, data }, cb) => {
	console.log(`Received: ${data}`);
	const json = JSON.parse(data);
	if (!cmdHandlers.has(cmd)) {
		console.log(`No handler defined for: ${cmd}`);
		return cb?.({ success: false, err: 'No handler defined for that commnad' });
	}

	cmdHandlers.get(cmd)(json, cb);
});
