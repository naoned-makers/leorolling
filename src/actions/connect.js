const TYPE = 'CONNECT'

export class ConnectAction {

  constructor(device) {
    this.type = TYPE;
    this.device = device;
  }

}
