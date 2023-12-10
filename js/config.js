const MQTT_HOST = process.env.MQTT_HOST ?? 'localhost';
const MQTT_PORT = process.env.MQTT_PORT ?? 1883;
const MQTT_ADDR = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;

const BROKER_HOST = process.env.BROKER_HOST ?? 'localhost';
const BROKER_PORT = process.env.BROKER_PORT ?? 3000;
const BROKER_ADDR = `ws://${BROKER_HOST}:${BROKER_PORT}`;

export { MQTT_ADDR, BROKER_ADDR };
