export class Order {

	constructor(code) {
		this.codeByte = code;
		this.headerBytes = [0xBA, 0xBA, 0xAA, 0xAA ];
	}

	dataToSend(bytesValue) {
	  var buf = new ArrayBuffer(this.headerBytes.length + 1 + bytesValue.length);
	  var bufView = new Uint8Array(buf);
	  var idx = 0;
	  // Gestion de l'inversion par paire des bytes

	  for (let i = 0; i < this.headerBytes.length; i+=1) {
	    bufView[idx++] = this.headerBytes[i];
	  }

	  bufView[idx++] = this.codeByte;

	  // Gestion de l'inversion par paire des bytes
	  for (let i = 0; i < bytesValue.length; i+=1) {
	    bufView[idx++] = bytesValue[i];
	  }
	  return buf;
	}
}
