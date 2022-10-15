import React from 'react';
import './Sender.css';

import { Button, Container, Box, Slider, Typography } from '@material-ui/core';
import QRCode from 'qrcode.react';

const BEEP_CORRELATE_MIN = 800;
const BEEP_CORRELATE_MAX = 1200;
const TICK = 50;
const EACH_PACKET_SIZE = 600;

enum SenderTransferState {
  SENDING_HEADER_PACKET,
  SENDING_DATA_PACKETS,
  PAUSED,
}

type SenderState = {
  eachPacketSize: number,
  data?: string,

  currentPacketNumber: number,
  totalNumberOfPackets: number,
  currentPacketData?: string,

  transferState: SenderTransferState,
}

type SenderProps = {}

class Sender extends React.Component<SenderProps, SenderState> {

  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;

  constructor(props: SenderProps) {
    super(props);

    this.state = {
      eachPacketSize: EACH_PACKET_SIZE,
      currentPacketNumber: 0,
      totalNumberOfPackets: 0,
      transferState: SenderTransferState.PAUSED,
    }

    setInterval(() => this.tick(), TICK);

    this.sendHeader = this.sendHeader.bind(this);
    this.stop = this.stop.bind(this);
  }

  sendHeader() {
    const data = '1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk1234567890abcdefghiqk';
    const totalNumberOfPackets = Math.ceil(data.length / this.state.eachPacketSize);

    this.setState({
      data,
      currentPacketNumber: -1,
      totalNumberOfPackets: totalNumberOfPackets,
      transferState: SenderTransferState.SENDING_HEADER_PACKET,
      currentPacketData: this.constructHeaderPacket(totalNumberOfPackets, 'todo')
    });

    // Sound
    let source;
    this.audioContext = new (window.AudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.minDecibels = -100;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      // No audio allowed
      alert('Sorry, getUserMedia is required for the app.')
    } else {
      let constraints = {audio: true};
      navigator.mediaDevices.getUserMedia(constraints)
        .then(
          (stream) => {
            if (!this.audioContext || !this.analyser) return;

            // Initialize the SourceNode
            source = this.audioContext.createMediaStreamSource(stream);
            // Connect the source node to the analyzer
            source.connect(this.analyser);
            // visualize();
          }
        )
        .catch(function(err) {
          alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
        });
    }
  }

  sendData = () => {
    this.setState({
      currentPacketNumber: -1,
      transferState: SenderTransferState.SENDING_DATA_PACKETS,
    });

    this.goToNextDataPacket();
  }

  stop() {
    this.setState({ transferState: SenderTransferState.PAUSED });
    // this.setState({
    //   data: undefined,
    //   currentPacketNumber: 0,
    //   totalNumberOfPackets: 0,
    //   currentPacketData: undefined
    // })
  }

  tick() {
    switch(this.state.transferState) {
      case(SenderTransferState.PAUSED): break;
      case(SenderTransferState.SENDING_HEADER_PACKET): break;
      case(SenderTransferState.SENDING_DATA_PACKETS):
        if (this.checkHasBeep()) this.goToNextDataPacket();
        break;
    }
  }

  private checkHasBeep(): boolean {

    if (!this.audioContext || !this.analyser) return false;
    let bufferLength = this.analyser.fftSize;
    let buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);
    let autoCorrelateValue = this.autoCorrelate(buffer, this.audioContext.sampleRate)

    if (autoCorrelateValue > -1) console.log('autoCorrelateValue', autoCorrelateValue);
    return autoCorrelateValue >= BEEP_CORRELATE_MIN && autoCorrelateValue <= BEEP_CORRELATE_MAX;
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    // Perform a quick root-mean-square to see if we have enough signal
    let SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];
      sumOfSquares += val * val;
    }
    let rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
      return -1;
    }
  
    // Find a range in the buffer where the values are below a given threshold.
    let r1 = 0;
    let r2 = SIZE - 1;
    let threshold = 0.2;
  
    // Walk up for r1
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
  
    // Walk down for r2
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }
  
    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length
  
    // Create a new array of the sums of offsets to do the autocorrelation
    let c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
      }
    }
  
    // Find the last index where that value is greater than the next one (the dip)
    let d = 0;
    while (c[d] > c[d+1]) {
      d++;
    }
  
    // Iterate from that index through the end and find the maximum sum
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }
  
    let T0 = maxIndex;
  
    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    let x1 = c[T0 - 1];
    let x2 = c[T0];
    let x3 = c[T0 + 1]
  
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2
    if (a) {
      T0 = T0 - b / (2 * a);
    }
  
    return sampleRate/T0;
  }

  private constructHeaderPacket(totalNumberOfPackets: number, taskName: string): string {
    return `@${totalNumberOfPackets}|${taskName}`;
  }

  private goToNextDataPacket() {
    if (!this.state.data) return; // do nothing if packet is empty
    let nextPacket = (this.state.currentPacketNumber + 1) % this.state.totalNumberOfPackets;
    this.setState({
      currentPacketNumber: nextPacket,
      currentPacketData: this.retrieveCurrentPacket(this.state.data, this.state.eachPacketSize, nextPacket, this.state.totalNumberOfPackets),
    });
  }

  private retrieveCurrentPacket(data:string, packetSize: number, currentPacketNumber: number, totalNumberOfPackets: number) {
    // return (currentPacketNumber+1) + '/' + totalNumberOfPackets + "|" + data.substr(currentPacketNumber * packetSize, packetSize);
    return (currentPacketNumber) + "|" + data.substr(currentPacketNumber * packetSize, packetSize);
  }

  private convertFrameToColor(frame: number) {
    let d = frame % 6;
    if (d == 0) {
      return "#FF0000";
    }
    else if (d == 1) {
      return "#00FF00";
    }
    else if (d == 2) {
      return "#0000FF";
    }
    else 

    switch(frame % 6) {
      case 0:
        return ''
      case 1:
        return ''
      case 1:
        return ''
      case 1:
        return ''
      case 1:
        
      default:
        // code block
    }
  }

  render() {
    return <Container maxWidth="sm">
      <h3>Send</h3>
      
      { this.state ? <Box>
        <Box alignItems="center" style={{backgroundColor: 'white', padding: 10, width: "60vmin", height: "60vmin"}}>
        {/* fgColor={this.convertFrameToColor(this.state.currentPacketNumber)} */}
          { this.state.currentPacketData != null ? <QRCode value={this.state.currentPacketData} renderAs='svg' level="H" bgColor="#00000000" style={{width: "55vmin", height: "55vmin"}} /> : null }
        </Box>
        <Typography id="send-progress" gutterBottom>
          Progress <span>{this.state.currentPacketNumber+1}</span>/<span>{this.state.totalNumberOfPackets}</span>
        </Typography>
        <Slider
          value={this.state.currentPacketNumber+1}
          //getAriaValueText={(this.state.currentPacketNumber+1).toString()}
          aria-labelledby="send-progress"
          step={1}
          marks
          min={1}
          max={this.state.totalNumberOfPackets}
          valueLabelDisplay="auto"
          style={{width: "74vmin"}}
        />
      </Box>: null}
      <Button variant="contained" color="primary" onClick={this.sendHeader}>Header</Button>
      {this.state.transferState == SenderTransferState.SENDING_DATA_PACKETS ? 
      <Button variant="contained" color="secondary" onClick={this.stop}>Stop</Button>:
      <Button variant="contained" color="primary" onClick={this.sendData}>Start</Button>
      }
    </Container>;
  }
}

export default Sender;