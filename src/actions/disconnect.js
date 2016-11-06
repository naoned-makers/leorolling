import { ACTIONS } from "../reducer";

export class DisconnectAction {

  constructor() {
    this.type = ACTIONS.DISCONNECT;
    this.device = null;
  }

}
