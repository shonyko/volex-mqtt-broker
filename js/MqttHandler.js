// const mqtt = require('mqtt');
import mqtt from 'mqtt';
// const { BROKER_ADDR, MQTT_PORT } = require('./config.js');
import { BROKER_ADDR, MQTT_PORT } from './config.js';

export default class MqttHandler {
	constructor(topics) {
		this.client = null;
		this.host = `${BROKER_ADDR}:${MQTT_PORT}`;
		this.topics = topics;
		this.callbacks = {};
	}

	connect() {
		// Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
		this.client = mqtt.connect(this.host);

		// Mqtt error calback
		this.client.on('error', err => {
			console.log(`An error occured: ${err}`);
			this.client.end();
		});

		// Connection callback
		this.client.on('connect', _ => {
			console.log(`mqtt client connected`);
			this.topics.forEach(topic => {
				this.client.subscribe(topic, { qos: 0 });
			});
		});

		// When a message arrives, console.log it
		this.client.on('message', (topic, message) => {
			const json = message.toString();
			console.log(`[${topic}]: ${json}`);
			const callbacksArr = this.callbacks[topic];
			if (!callbacksArr) return;

			callbacksArr.forEach(async callback => {
				await callback(json);
			});
		});

		this.client.on('close', () => {
			console.log(`mqtt client disconnected`);
		});
	}

	on(topic, fn) {
		if (!this.callbacks[topic]) this.callbacks[topic] = [];
		this.callbacks[topic].push(fn);
	}

	sendData(topic, data) {
		this.client.publish(`${topic}`, `${data}`);
	}
}
