export class BluetoothDevice {

	constructor(name, disconnectFct) {
		this.name = name;
		this.services = {};
		this.device = undefined;
		this.server = undefined;
		this.disconnectFct = disconnectFct;
	}

	addService(id, uuid) {
		this.services[id] = new BluetoothService(uuid);
	}

	addCharacteristic(id, cId, uuid) {
		if (!this.services[id]) {
			throw new Error("Service id unknowned :" + id);
		}
		this.services[id].characteristics[cId] = new BluetoothCharacteristic(uuid);
	}

	getDevice() {

		if (this.device) {
			return Promise.resolve(this.device);
		} else {

			let filters = [{
				name: this.name
			}];

			if (this.services) {
				filters[0].services = [];
				Object.keys(this.services).forEach((key) => {
		    	filters[0].services.push(this.services[key].uuid);
				});
			}

			return navigator.bluetooth.requestDevice({filters: filters})
		  .then(device => {
		    this.device = device;
		    device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
		    return device;
		  })
		}

	}

	connect() {
		if (this.server) {
			return Promise.resolve(this.server);
		} else {
			return this.getDevice().then((device) => {
				return device.gatt.connect();
			}).then((server) => {
				this.server = server;
				return server;
			});
		}
	}

	getService(id) {
		if (!this.services[id]) {
			throw new Error("Service id unknowned :" + id);
		}
		if (!this.server) {
			throw new Error("Server GATT not initialized.");
		}
		if (this.services[id].service) {
			return Promise.resolve(this.services[id]);
		} else {
			return this.connect().then(server => {
				return this.server.getPrimaryService(this.services[id].uuid)
		  })
			.then((service) => {
				this.services[id].service = service;
				return this.services[id];
			});
		}
	}

	onDisconnected() {
		this.server = undefined;
		for(let serviceId in this.services) {
			let serv = this.services[serviceId];
			delete serv.service;
			for(let characteristicId in serv.characteristics) {
				let charact = serv.characteristics[characteristicId];
				delete charact.characteristic;
			}
		}

		if (this.disconnectFct) {
			this.disconnectFct();
		}
	  console.log('Device ' + this + ' is disconnected.');
	}

	disconnect() {
	  if (!this.device) {
	    return;
	  }

	  if (this.device.gatt.connected) {
	    this.device.gatt.disconnect();
	  } else {
	    console.log('Bluetooth Device is already disconnected');
	  }
	}
}

export class BluetoothService {
	constructor(uuid) {
		this.uuid = uuid;
		this.characteristics = {};
		this.service = undefined;
	}

	addCharacteristic(id, uuid) {
		this.characteristics[id] = new BluetoothCharacteristic(uuid);
	}


	getCharacteristic(id) {
		if (!this.characteristics[id]) {
			throw new Error("Characteristic id unknowned :" + id);
		}
		if (!this.service) {
			throw new Error("Service not initialized.");
		}
		if (this.characteristics[id].characteristic) {
			return Promise.resolve(this.characteristics[id]);
		} else {
			return this.service.getCharacteristic(this.characteristics[id].uuid)
			.then((characteristic) => {
				this.characteristics[id].characteristic = characteristic;
				return this.characteristics[id];
			});
		}
	}

}

export class BluetoothCharacteristic{
	constructor(uuid) {
		this.uuid = uuid;
		this.characteristic = undefined;
	}

	write(arrayBuffer) {
		if (!this.characteristic) {
			Promise.reject(new Error("Characteristic not initialized, use getCharacteristic on service."));
		}
		return this.characteristic.writeValue(arrayBuffer);
	}
}
