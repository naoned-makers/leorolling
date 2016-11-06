import React from 'react'
import {Connect} from "./connect";
import {Driver} from "./driver";
import {Message} from "./message";

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {connected: false, device: null, showMessage: false, message: ""};
    if (!navigator.bluetooth) {
      this.state.showMessage = true;
      this.state.message = {__html: "Interface Web Bluetooth indisponible. Veuillez l'activer :<p><a class='link' target=\"_blank\" href=\"chrome://flags/#enable-web-bluetooth\">chrome://flags/#enable-web-bluetooth</a></p>"};
    }
  }

  render() {
    return (<div>
      <Message show={this.state.showMessage} message={this.state.message}/>
      {!this.state.connected ? (
        <Connect connect={this.connect.bind(this)}  disconnect={this.disconnect.bind(this)} showMessage={this.showMessage.bind(this)}/>
      ) : (
        <Driver device={this.state.device} showMessage={this.showMessage.bind(this)}/>
      )}
    </div>);
  }

  connect(bleDevice) {
    this.setState({connected: true, device: bleDevice });
  }

  disconnect() {
    this.setState({connected: false, device: null });
  }

  showMessage(message) {
    if (message) {
      this.setState({showMessage: true, message: {__html: message} });
    } else {
      this.setState({showMessage: false, message: null });
    }
  }
}
