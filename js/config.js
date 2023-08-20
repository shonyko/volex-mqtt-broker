const IP = process.env.MQTT_HOST ?? '192.168.0.220';
const PORT = process.env.MQTT_PORT ?? 1883;

const addr = `mqtt://${IP}`;
export { addr as BROKER_ADDR, PORT as MQTT_PORT };
