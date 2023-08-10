const IP = process.env.MQTT_HOST ?? '192.168.0.220';
const PORT = process.env.MQTT_PORT ?? 1883;

module.exports = {
	BROKER_ADDR: `mqtt://${IP}`,
	MQTT_PORT: PORT,
};
