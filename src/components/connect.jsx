import * as React from 'react'
import {Baseplate} from "./baseplane";
import {BrickShape} from "./brickshape";
import {BluetoothDevice} from "../bluetooth/ble";

export class Connect extends React.Component {

    constructor(props, context) {
      super(props, context);

      this.bluetoothDevice = new BluetoothDevice("LEO", this.onDisconnected.bind(this));
      this.bluetoothDevice.addService("sCommand", "6e400001-b5a3-f393-e0a9-e50e24dcca9e");
      this.bluetoothDevice.addCharacteristic("sCommand", "cCommand", "6e400002-b5a3-f393-e0a9-e50e24dcca9e");
    }

    render() {
        return (
            <Baseplate width={18} height={26}>
              <BrickShape bricks={this.props.shapes[0].cells} classShape="lego blue upper"/>
              <BrickShape bricks={this.props.shapes[1].cells} onTouchStart={(e) => this.connect()} classShape="lego grey upper"/>
            </Baseplate>

        );
    }

    connect() {
      console.log("connexion");
      this.showMessage("Connexion à Léo en cours...");
    	this.bluetoothDevice.connect()
    	.then(() => {
    		return this.bluetoothDevice.getService("sCommand");
    	})
    	.then((bluetoothService) => {
    		return bluetoothService.getCharacteristic("cCommand");
    	})
    	.then(() => {
        this.showMessage("Vous êtes maintenant connecté à Léo... à vous de jouer !");
        setTimeout(() => {
          if (this.props.connect) {
            this.showMessage("");
            this.props.connect(this.bluetoothDevice);
          }
        }, 1000);
    	})
      .catch(error => {
        this.showMessage("Erreur lors de la connexion à Léo : " + error);
        console.log(error);
        setTimeout(() => {
          this.showMessage();
        }, 3000);
      });
    }

    onDisconnected() {
      if (this.props.disconnect) {
        this.props.disconnect();
      }
    }

    showMessage(msg){
      if (this.props.showMessage) {
        this.props.showMessage(msg);
      }
    }

}

Connect.defaultProps = {
  shapes : [{cells : [
              //L
              {x:3, y:2}, {x:3, y:3}, {x:3, y:4}, {x:3, y:5}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}, {x:6, y:6},
               //E
              {x:8, y:2}, {x:8, y:3}, {x:8, y:5}, {x:8, y:6},
              {x:9, y:2}, {x:10, y:2}, {x:11, y:2},
              {x:9, y:4}, {x:10, y:4},
              {x:9, y:6}, {x:10, y:6}, {x:11, y:6},
              // O
              {x:13, y:2}, {x:13, y:3}, {x:13, y:4}, {x:13, y:5}, {x:13, y:6},
              {x:14, y:2}, {x:15, y:2},
              {x:14, y:6}, {x:15, y:6}, {x:16, y:6},
              {x:16, y:3}, {x:16, y:4}, {x:16, y:5}
          ]
      },
      {cells : [
              {x:5, y:12}, {x:6, y:12}, {x:6, y:13}, {x:7, y:13}, {x:7, y:14}, {x:8, y:14}, {x:8, y:15},
              {x:5, y:20}, {x:6, y:20}, {x:6, y:19}, {x:7, y:19}, {x:7, y:18}, {x:8, y:18}, {x:8, y:17},
              {x:9, y:10}, {x:9, y:11}, {x:9, y:12}, {x:9, y:13}, {x:9, y:14}, {x:9, y:15}, {x:9, y:16}, {x:9, y:17}, {x:9, y:18}, {x:9, y:19}, {x:9, y:20}, {x:9, y:21}, {x:9, y:22},
              {x:10, y:10}, {x:10, y:11}, {x:10, y:12}, {x:10, y:13}, {x:10, y:14}, {x:10, y:15}, {x:10, y:16}, {x:10, y:17}, {x:10, y:18}, {x:10, y:19}, {x:10, y:20}, {x:10, y:21}, {x:10, y:22},
              {x:11, y:11}, {x:11, y:12}, {x:12, y:12}, {x:12, y:13}, {x:13, y:13}, {x:13, y:14}, {x:13, y:15}, {x:14, y:14},
              {x:12, y:15}, {x:12, y:16}, {x:11, y:16},
              {x:12, y:17}, {x:13, y:17}, {x:13, y:18}, {x:13, y:19}, {x:14, y:18},
              {x:12, y:19}, {x:12, y:20}, {x:11, y:20}, {x:11, y:21}
          ]
          }]
};
