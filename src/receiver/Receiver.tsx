import React, { createRef, MutableRefObject } from 'react';
import './Receiver.css';

import { Box, Button, Container } from '@material-ui/core';
import QRScanner from '../common/QRScanner/QRScanner';

type ReceiverProps = {}

type ReceiverState = {
  videoConstraints?: MediaStreamConstraints["video"],
  currentFacingMode: CameraFacingModes,
  decodedMessage: string,

  packets?: Array<string>,
}

enum CameraFacingModes {
  USER = 'user',
  ENVIRONMENT = 'environment'
}

class Receiver extends React.Component<ReceiverProps, ReceiverState> {

  qrScannerRef = createRef<QRScanner>();

  constructor(props: ReceiverProps) {
    super(props);
    this.onMessageChanged = this.onMessageChanged.bind(this);
    this.processData = this.processData.bind(this);
    this.restart = this.restart.bind(this);
  }

  onMessageChanged(newMessage: string) {
    this.setState({ decodedMessage: newMessage });
    this.processData(newMessage);
  }

  processData(newMessage: string) {
    //const regex = /(\d+)\/(\d+)\|(.*)/;
    const regex = /(?<current_packet>\d+)\/(?<total_packet>\d+)\|(?<data>.*)/;
    let matches = regex.exec(newMessage);
    if (this.state && matches && 
      matches.length >= 3 && 
      matches.groups &&
      matches.groups['current_packet'] && 
      matches.groups['total_packet'] &&
      matches.groups['data']) {
      
      let currentPacket = Number(matches.groups['current_packet'])
      let totalPacket = Number(matches.groups['total_packet'])
      let data = matches.groups['data'];

      this.setState( state => {
        let packets = state.packets;
        if (!packets) {
          packets = new Array<string>(totalPacket);
        }
        packets[currentPacket] = data;
        return {packets};
      });
    }
    else {
      if (matches) alert('data too short' + matches.length);
      else alert('data too short');
    }
  }

  restart() {
    this.setState({
      packets: undefined
    });
  }

  render() {    
    return <Container maxWidth="sm">
      <h3>Receive</h3>
      <p>{ this.state && this.state.decodedMessage ? this.state.decodedMessage : 'null' }</p>
      <Box>
        <QRScanner ref={this.qrScannerRef} messageChange={this.onMessageChanged} />
      </Box>
      <Button variant="contained" color="secondary" onClick={this.restart} >Restart</Button>
      {this.state && this.state.packets ? 
      <Box style={{backgroundColor: '#333'}}> 
        {this.state.packets.map((value, index) => {
          return value ? (<span>{value}</span>) : (<span>---</span>)
        })}
      </Box>: null}
      {/* <Button variant="contained" color="primary" onClick={this.toggleCamera} >Toggle Camera</Button> */}
      {/* <Button variant="contained" color="primary" onClick={this.receive} >Receive</Button> */}
    </Container>;
  }
}

export default Receiver;