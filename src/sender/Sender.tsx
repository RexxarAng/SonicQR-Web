import React, { ChangeEvent } from 'react';
import { v4 as uuid } from 'uuid';
import './Sender.css';

import { Button, Container, Box, Slider, Typography } from '@material-ui/core';
import QRCode from 'qrcode.react';

import { SonicQrDataEncoder } from '../utils/DataEncoder';
// import internal from 'stream';

const BEEP_FORWARD_CORRELATE_MIN = 360;
const BEEP_FORWARD_CORRELATE_MAX = 400;
const BEEP_BACK_CORRELATE_MIN = 1300;
const BEEP_BACK_CORRELATE_MAX = 1350;

// const PLAY_MODE = true;
// const TICK = 100;
// const BEEP_COOLDOWN_INTERVAL = 0;
// const EACH_PACKET_SIZE = 3000;

const PLAY_MODE = false;
const TICK = 5;
const BEEP_COOLDOWN_INTERVAL = 10;
const EACH_PACKET_SIZE = 1600;
// const EACH_PACKET_SIZE = 4250;
const RECEIVER_AUDIO_COOLDOWN = 70;

const VARIABLE_COOLDOWN_INTERVAL = false;
const CAN_REDRAW = false;
const REDRAW_INTERVAL = 100;


enum SenderTransferState {
  SENDING_HEADER_PACKET,
  SENDING_DATA_PACKETS,
  PAUSED,
}

enum BeepEnum {
  NO_BEEP,
  BEEP_FORWARD,
  BEEP_BACKWARD,
}

type QRDataPacket = {
  id: string,
  data: string,
}

type SenderState = {
  eachPacketSize: number,
  data?: string | null,
  dataPackets: Array<QRDataPacket>,

  currentPacketNumber: number,
  totalNumberOfPackets: number,
  currentPacketData?: string,

  transferState: SenderTransferState,

  selectedFile?: File,
}

type SenderProps = {}

class Sender extends React.Component<SenderProps, SenderState> {

  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  beepDetectionAudioWorkletProcessor: AudioWorkletNode | undefined;
  isSourceConnected: boolean = false;
  beepCoolDownRate: number = BEEP_COOLDOWN_INTERVAL;
  beepCoolDownCounter: number = 0;
  redrawCounter: number = REDRAW_INTERVAL;

  constructor(props: SenderProps) {
    super(props);

    this.state = {
      eachPacketSize: EACH_PACKET_SIZE,
      dataPackets: [],
      currentPacketNumber: 0,
      totalNumberOfPackets: 0,
      transferState: SenderTransferState.PAUSED,
    }

    // setInterval(() => this.tick(), TICK);
    this.tickLoop();


    this.sendHeader = this.sendHeader.bind(this);
    this.stop = this.stop.bind(this);
  }

  tickLoop = () => {
    setTimeout(() => {
      this.tick();
      this.tickLoop();
    }, TICK);
  }

  onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('trigger', event)
    if (
      event == null ||
      event.target == null ||
      event.target.files == null ||
      event.target.files.length <= 0) return;
    this.setState({ selectedFile: event.target.files[0] });

    // TODO : move this code to a lib function
    console.log(event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      if (typeof event?.target?.result == 'string') {
        this.setState({ data: event?.target?.result });
        console.log(event?.target?.result);

        this.sendHeader();
      }

      if (event?.target?.result instanceof ArrayBuffer) {
        const dataEncoder = new SonicQrDataEncoder();
        const encodedData = dataEncoder.encode(new Uint8Array(event.target.result));
        console.log(encodedData.length);
        this.setState({
          data: encodedData
        });
        this.sendHeader();
      }
    });
    reader.readAsArrayBuffer(event.target.files[0]);
    // reader.readAsDataURL(event.target.files[0]);
  };

  connectSource() {
    if (!this.source || !this.analyser) return;
    
    this.source.connect(this.analyser);
    this.isSourceConnected = true;
    // console.log('connect source');
  }
  disconnectSource() {
    if (!this.source || !this.analyser) return;
    
    this.source.disconnect(this.analyser);
    this.isSourceConnected = false;
    // console.log('disconnect source');
  }

  async loadWorkletModule(source: AudioNode) {
    const workletModulePath = 'lib/worklet/beep-detection-processor.js';
    try {
      // Check if audioContext is null
      if (!this.audioContext) return;

      console.log(`loading module: '${workletModulePath}'`);
      await this.audioContext.audioWorklet.addModule(workletModulePath);

      const beepDetectionNode = new AudioWorkletNode(
        this.audioContext,
        'beep-detection-audio-worklet-processor'
      );
      console.log('connect source (at the start)');
      source.connect(beepDetectionNode);
      // this.beepDetectionAudioWorkletProcessor = new AudioWorkletNode(this.audioContext, 'beep-detection-audio-worklet-processor');
      // beepDetectionNode.connect(source);
      console.log(source);
      console.log(beepDetectionNode);
    } catch(e) {
      console.log(`Failed to load module '${workletModulePath}'`);
    }
  }

  sendHeader() {
    if (!this.state.data) return;

    // TODO: Testing
    this.computeDataPackets();

    const totalNumberOfPackets = Math.ceil(this.state.data.length / this.state.eachPacketSize);

    this.setState({
      currentPacketNumber: -1,
      totalNumberOfPackets: totalNumberOfPackets,
      transferState: SenderTransferState.SENDING_HEADER_PACKET,
      currentPacketData: this.constructHeaderPacket(),
    });

    // Sound
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
            this.source = this.audioContext.createMediaStreamSource(stream);
            // Connect the source node to the analyzer
            console.log('connect source (at the start)');
            // this.source.connect(this.analyser);
            this.connectSource();
            // this.loadWorkletModule(source)
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
  }

  tick() {
    switch(this.state.transferState) {
      case(SenderTransferState.PAUSED): break;
      case(SenderTransferState.SENDING_HEADER_PACKET): break;
      case(SenderTransferState.SENDING_DATA_PACKETS):
        if (PLAY_MODE) { 
          this.goToNextDataPacket();
          return;
        }

        if (this.beepCoolDownCounter > 0) {
          this.beepCoolDownCounter --;
        }
        else if (this.beepCoolDownCounter == 0 && !this.isSourceConnected) {
          this.connectSource();
          this.beepCoolDownCounter --;
        }
        else {
          const beepSound = this.checkHasBeep();
          switch (beepSound) {
            case BeepEnum.BEEP_FORWARD:
              this.goToNextDataPacket();
              if (VARIABLE_COOLDOWN_INTERVAL && this.beepCoolDownRate > 2) {
                this.beepCoolDownRate -= 1;
              }
              this.beepCoolDownCounter = this.beepCoolDownRate;
              this.disconnectSource();
              break;
            case BeepEnum.BEEP_BACKWARD:
              this.goToPreviousDataPacket();
              if (VARIABLE_COOLDOWN_INTERVAL) {
                this.beepCoolDownRate += 4;
              }
              this.beepCoolDownCounter = this.beepCoolDownRate;
              
              this.disconnectSource();
              break;
            default:
              if (CAN_REDRAW && this.redrawCounter <= 0) {
                this.goToCurrentDataPacket();
              }
          }
        }

        this.redrawCounter --;

        console.log('beepCoolDownRate :' + this.beepCoolDownRate)

        // else if (this.checkHasBeep()) {
        //   console.log('detected beep');
        //   this.goToNextDataPacket();
        //   this.beepCoolDownCounter = BEEP_COOLDOWN_INTERVAL;
        //   this.disconnectSource();
        // }
        // break;
    }
  }

  private checkHasBeep(): BeepEnum {

    if (!this.audioContext || !this.analyser) return BeepEnum.NO_BEEP;
    let bufferLength = this.analyser.fftSize;
    let buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);
    let autoCorrelateValue = this.autoCorrelate(buffer, this.audioContext.sampleRate);

    if (autoCorrelateValue > -1) console.log('autoCorrelateValue', autoCorrelateValue);
    
    if (
      autoCorrelateValue >= BEEP_FORWARD_CORRELATE_MIN &&
      autoCorrelateValue <= BEEP_FORWARD_CORRELATE_MAX)
      return BeepEnum.BEEP_FORWARD;
    else if (
      autoCorrelateValue >= BEEP_BACK_CORRELATE_MIN &&
      autoCorrelateValue <= BEEP_BACK_CORRELATE_MAX)
      return BeepEnum.BEEP_BACKWARD;
    else
      return BeepEnum.NO_BEEP;
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

  private constructHeaderPacket(): string {
    const file = this.state.selectedFile!;
    return `@${this.state.dataPackets.length}|${file.name}|${file.type}|${file.size}|checksumtodo|${RECEIVER_AUDIO_COOLDOWN}`;
  }

  private goToCurrentDataPacket() {
    if (!this.state.data) return; // do nothing if data is empty

    let packetIndex = this.state.currentPacketNumber;
    this.setState({
      currentPacketNumber: packetIndex,
      currentPacketData: this.retrieveCurrentPacket(this.state.data, this.state.eachPacketSize, packetIndex),
    });

    this.redrawCounter = REDRAW_INTERVAL;
  }

  private goToPreviousDataPacket() {
    if (!this.state.data) return; // do nothing if data is empty

    if (this.state.currentPacketNumber == 0) return;

    let packetIndex = (this.state.currentPacketNumber - 1);
    this.setState({
      currentPacketNumber: packetIndex,
      currentPacketData: this.retrieveCurrentPacket(this.state.data, this.state.eachPacketSize, packetIndex),
    });

    this.redrawCounter = REDRAW_INTERVAL;
  }

  private goToNextDataPacket() {
    if (!this.state.data) return; // do nothing if data is empty
    
    if (!PLAY_MODE && this.state.currentPacketNumber >= this.state.dataPackets.length-1) return;

    // only loop for mode without audio acknowledge
    let packetIndex = (this.state.currentPacketNumber + 1) % this.state.totalNumberOfPackets;
    this.setState({
      currentPacketNumber: packetIndex,
      currentPacketData: this.retrieveCurrentPacket(this.state.data, this.state.eachPacketSize, packetIndex),
    });

    this.redrawCounter = REDRAW_INTERVAL;
  }

  private computeDataPackets() {
    if (!this.state.data) return; // do nothing if data is empty

    let data = this.state.data;

    let packets: Array<QRDataPacket> = [];
    let totalNumberOfPackets = Math.ceil(data.length / EACH_PACKET_SIZE);
    for (let i = 0; i < totalNumberOfPackets; i++) {
      let curData = data.substring(i * EACH_PACKET_SIZE, i * EACH_PACKET_SIZE + EACH_PACKET_SIZE);
      // if (curData.length < EACH_PACKET_SIZE) {
      //   curData += '|';
      //   curData = curData.padEnd(EACH_PACKET_SIZE-curData.length, '0');
      // }
      
      packets.push({
        id: i.toString(),
        data: curData,
      });
    }
    
    this.setState({ dataPackets: packets });
  }

  private retrieveCurrentPacket(data:string, packetSize: number, currentPacketNumber: number) {
    return (currentPacketNumber) + ":" + this.state.dataPackets[currentPacketNumber].data;
    // return (currentPacketNumber) + "|" + this.state.dataPackets[currentPacketNumber].data + '|' + uuid().replace(/-/g, '');
    //return (currentPacketNumber) + "|" + data.substring(currentPacketNumber * packetSize, currentPacketNumber * packetSize + packetSize);
  }

  private convertFrameToColor(frame: number) {
    let d = frame % 3;
    switch(d) {
      case 0: return '#FF0000';
      case 1: return '#00FF00';
      case 2: return '#0000FF';
      default: return '#000000';
    }
  }

  render() {
    return <Container maxWidth="sm">
      <h3>Send</h3>
      <input type="file" onChange={this.onFileChange} />
      
      {this.state ? <Box>
        <Box alignItems="center" className='animate-left-right' style={{backgroundColor: 'white', padding: 10, width: "60vmin", height: "60vmin"}}>
          { this.state.currentPacketData != null ? <QRCode value={this.state.currentPacketData} renderAs='svg' level="L" bgColor="#00000000" style={{width: "55vmin", height: "55vmin"}} /> : null }
        </Box>
        
        {/* <Box alignItems="center" style={{backgroundColor: 'white', padding: 10, width: "60vmin", height: "60vmin"}}>
          {this.state.dataPackets.map((item, index) => {
            return <div 
            key={item.id}
            style={{display: index != this.state.currentPacketNumber ? '' : '', width: "55vmin", height: "55vmin"}}>
              {this.state.currentPacketNumber}
            </div>
            // style={{width: "55vmin", height: "55vmin"}}>{item.data}</div>
            // return <QRCode 
            //   key={item.id}
            //   value={item.data}
            //   renderAs='svg'
            //   level="H"
            //   bgColor="#00000000"
            //   // style={{display: index != this.state.currentPacketNumber ? 'none' : '', width: "55vmin", height: "55vmin"}} />
            //   style={{width: "55vmin", height: "55vmin"}} />
          })}
        </Box> */}
        
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