// const mqtt = require('mqtt');
import mqtt from 'mqtt';
// const { BROKER_ADDR, MQTT_PORT } = require('./config.js');
import { MQTT_ADDR } from './config.js';

export default class MqttHandler {
	constructor(topics) {
		this.client = null;
		this.host = MQTT_ADDR;
		this.topics = topics;
		this.callbacks = new Map();
		this.pinValueCallback = null;
	}

	connect() {
		// Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
		this.client = mqtt.connect(this.host);

		// Mqtt error calback
		this.client.on('error', err => {
			console.log(`[MQTT] An error occured: `, err);
			this.client.end();
		});

		// Connection callback
		this.client.on('connect', _ => {
			console.log(`mqtt client connected`);
			// # - multi  level
			// + - single level
			this.client.subscribe('pin/+', { qos: 0, nl: true });
			this.topics.forEach(topic => {
				this.client.subscribe(topic, { qos: 0 });
			});
		});

		// When a message arrives, console.log it
		this.client.on('message', (topic, message) => {
			const json = message.toString();
			console.log(`[${topic}]: ${json}`);
			if (topic.startsWith('pin/')) {
				return this.pinValueCallback(topic, json);
			}
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

	onPinValue(fn) {
		this.pinValueCallback = fn;
	}

	sendData(topic, data) {
		console.log(`Sending to [${topic}]: `, data);
		this.client.publish(`${topic}`, `${data}`);
	}
}
