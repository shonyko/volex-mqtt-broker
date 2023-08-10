const { BROKER_ADDR, DB_PORT } = require('./js/config');

const MqttHandler = require('./js/MqttHandler');
const mqttClient = new MqttHandler(['conn', 'conf']);

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
	mqttClient.sendData(`${macAddr}`, JSON.stringify({ inputs: ['V0'] }));
});

mqttClient.connect();
