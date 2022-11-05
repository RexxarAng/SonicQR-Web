import React, { ChangeEvent } from 'react';
import './Sender.css';

import { Button, Container, Box, Slider, Typography, Grid, Paper, Switch, FormControlLabel} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import QRCode from 'qrcode.react';

import { DataEncodingType, SonicQrDataEncoder } from '../utils/DataEncoder';

const BEEP_FORWARD_CORRELATE_MIN = 360;
const BEEP_FORWARD_CORRELATE_MAX = 400;
const BEEP_BACK_CORRELATE_MIN = 1300;
const BEEP_BACK_CORRELATE_MAX = 1350;

const QRCodeErrorCorrectionLevel = ['L', 'M', 'Q', 'H'];

const QRCodeVersions = [
  { label: '1', size: '21x21', alphaNumeric: { L: 25, M: 20, Q: 16, H:10 }, binary: { L: 17, M: 14, Q: 11, H: 7 } },
  { label: '2', size: '25x25', alphaNumeric: { L: 47, M: 38, Q: 29, H:20 }, binary: { L: 32, M: 26, Q: 20, H: 14 } },
  { label: '3', size: '29x29', alphaNumeric: { L: 77, M: 61, Q: 47, H:32 }, binary: { L: 53, M: 42, Q: 32, H: 24 } },
  { label: '4', size: '33x33', alphaNumeric: { L: 114, M: 90, Q: 67, H:46 }, binary: { L: 78, M: 62, Q: 46, H: 34 } },
  { label: '5', size: '37x37', alphaNumeric: { L: 154, M: 122, Q: 87, H:60 }, binary: { L: 106, M: 84, Q: 60, H: 44 } },
  { label: '6', size: '41x41', alphaNumeric: { L: 195, M: 154, Q: 108, H:74 }, binary: { L: 134, M: 106, Q: 74, H: 58 } },
  { label: '7', size: '45x45', alphaNumeric: { L: 224, M: 178, Q: 125, H:86 }, binary: { L: 154, M: 122, Q: 86, H: 64 } },
  { label: '8', size: '49x49', alphaNumeric: { L: 279, M: 221, Q: 157, H:108 }, binary: { L: 192, M: 152, Q: 108, H: 84 } },
  { label: '9', size: '53x53', alphaNumeric: { L: 335, M: 262, Q: 189, H:130 }, binary: { L: 230, M: 180, Q: 130, H: 98 } },
  { label: '10', size: '57x57', alphaNumeric: { L: 395, M: 311, Q: 221, H:151 }, binary: { L: 271, M: 213, Q: 151, H: 119 } },
  { label: '11', size: '61x61', alphaNumeric: { L: 468, M: 366, Q: 259, H:177 }, binary: { L: 321, M: 251, Q: 177, H: 137 } },
  { label: '12', size: '65x65', alphaNumeric: { L: 535, M: 419, Q: 296, H:203 }, binary: { L: 367, M: 287, Q: 203, H: 155 } },
  { label: '13', size: '69x69', alphaNumeric: { L: 619, M: 483, Q: 352, H:241 }, binary: { L: 425, M: 331, Q: 241, H: 177 } },
  { label: '14', size: '73x73', alphaNumeric: { L: 667, M: 528, Q: 376, H:258 }, binary: { L: 458, M: 362, Q: 258, H: 194 } },
  { label: '15', size: '77x77', alphaNumeric: { L: 758, M: 600, Q: 426, H:292 }, binary: { L: 520, M: 412, Q: 292, H: 220 } },
  { label: '16', size: '81x81', alphaNumeric: { L: 854, M: 656, Q: 470, H:322 }, binary: { L: 586, M: 450, Q: 322, H: 250 } },
  { label: '17', size: '85x85', alphaNumeric: { L: 938, M: 734, Q: 531, H:364 }, binary: { L: 644, M: 504, Q: 364, H: 280 } },
  { label: '18', size: '89x89', alphaNumeric: { L: 1046, M: 816, Q: 574, H:394 }, binary: { L: 718, M: 560, Q: 394, H: 310 } },
  { label: '19', size: '93x93', alphaNumeric: { L: 1153, M: 909, Q: 644, H:442 }, binary: { L: 792, M: 624, Q: 442, H: 338 } },
  { label: '20', size: '97x97', alphaNumeric: { L: 1249, M: 970, Q: 702, H:482 }, binary: { L: 858, M: 666, Q: 482, H: 382 } },
  { label: '21', size: '101x101', alphaNumeric: { L: 1352, M: 1035, Q: 742, H:509 }, binary: { L: 929, M: 711, Q: 509, H: 403 } },
  { label: '22', size: '105x105', alphaNumeric: { L: 1460, M: 1134, Q: 823, H:565 }, binary: { L: 1003, M: 779, Q: 565, H: 439 } },
  { label: '23', size: '109x109', alphaNumeric: { L: 1588, M: 1248, Q: 890, H:611 }, binary: { L: 1091, M: 857, Q: 611, H: 461 } },
  { label: '24', size: '113x113', alphaNumeric: { L: 1704, M: 1326, Q: 963, H:661 }, binary: { L: 1171, M: 911, Q: 661, H: 511 } },
  { label: '25', size: '117x117', alphaNumeric: { L: 1853, M: 1451, Q: 1041, H:715 }, binary: { L: 1273, M: 997, Q: 715, H: 535 } },
  { label: '26', size: '121x121', alphaNumeric: { L: 1990, M: 1542, Q: 1094, H:751 }, binary: { L: 1367, M: 1059, Q: 751, H: 593 } },
  { label: '27', size: '125x125', alphaNumeric: { L: 2132, M: 1637, Q: 1172, H:805 }, binary: { L: 1465, M: 1125, Q: 805, H: 625 } },
  { label: '28', size: '129x129', alphaNumeric: { L: 2223, M: 1732, Q: 1263, H:868 }, binary: { L: 1528, M: 1190, Q: 868, H: 658 } },
  { label: '29', size: '133x133', alphaNumeric: { L: 2369, M: 1839, Q: 1322, H:908 }, binary: { L: 1628, M: 1264, Q: 908, H: 698 } },
  { label: '30', size: '137x137', alphaNumeric: { L: 2520, M: 1994, Q: 1429, H:982 }, binary: { L: 1732, M: 1370, Q: 982, H: 742 } },
  { label: '31', size: '141x141', alphaNumeric: { L: 2677, M: 2113, Q: 1499, H:1030 }, binary: { L: 1840, M: 1452, Q: 1030, H: 790 } },
  { label: '32', size: '145x145', alphaNumeric: { L: 2840, M: 2238, Q: 1618, H:1112 }, binary: { L: 1952, M: 1538, Q: 1112, H: 842 } },
  { label: '33', size: '149x149', alphaNumeric: { L: 3009, M: 2369, Q: 1700, H:1168 }, binary: { L: 2068, M: 1628, Q: 1168, H: 898 } },
  { label: '34', size: '153x153', alphaNumeric: { L: 3183, M: 2506, Q: 1787, H:1228 }, binary: { L: 2188, M: 1722, Q: 1228, H: 958 } },
  { label: '35', size: '157x157', alphaNumeric: { L: 3351, M: 2632, Q: 1867, H:1283 }, binary: { L: 2303, M: 1809, Q: 1283, H: 983 } },
  { label: '36', size: '161x161', alphaNumeric: { L: 3537, M: 2780, Q: 1966, H:1351 }, binary: { L: 2431, M: 1911, Q: 1351, H: 1051 } },
  { label: '37', size: '165x165', alphaNumeric: { L: 3729, M: 2894, Q: 2071, H:1423 }, binary: { L: 2563, M: 1989, Q: 1423, H: 1093 } },
  { label: '38', size: '169x169', alphaNumeric: { L: 3927, M: 3054, Q: 2181, H:1499 }, binary: { L: 2699, M: 2099, Q: 1499, H: 1139 } },
  { label: '39', size: '173x173', alphaNumeric: { L: 4087, M: 3220, Q: 2298, H:1579 }, binary: { L: 2809, M: 2213, Q: 1579, H: 1219 } },
  { label: '40', size: '177x177', alphaNumeric: { L: 4296, M: 3391, Q: 2420, H:1663 }, binary: { L: 2953, M: 2331, Q: 1663, H: 1273 } },
]

const DATA_FRAME_OVERHEAD_CHARACTERS = 11;
const BEEP_COOLDOWN_INTERVAL = 10;
const EACH_PACKET_SIZE = 1600;
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
  digest?: string | null,
  dataPackets: Array<QRDataPacket>,

  currentPacketNumber: number,
  totalNumberOfPackets: number,
  currentPacketData?: string,

  transferState: SenderTransferState,

  selectedFile?: File,

  tick: number,
  isAudioAckMode: boolean,
  selectedEncoding: DataEncodingType,
  selectedQRCodeVersion: number,
  selectedQRCodeErrorCorrectionLevel: string,
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
      tick: 5,
      isAudioAckMode: true,
      selectedEncoding: DataEncodingType.base45,
      selectedQRCodeVersion: 20,
      selectedQRCodeErrorCorrectionLevel: 'L',
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
    }, this.state.tick);
  }

  onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('trigger', event)
    if (
      event == null ||
      event.target == null ||
      event.target.files == null ||
      event.target.files.length <= 0) return;

    this.setState({ selectedFile: event.target.files[0] });

    setTimeout(() => {this.decodeFile()}, 100);
  };

  decodeFile = async () => {
    if (this.state.selectedFile == null) return;
    const dataEncoder = new SonicQrDataEncoder();
    const encodedData = await dataEncoder.encode(this.state.selectedFile, this.state.selectedEncoding);

    this.setState({ 
      data: encodedData.encodedData,
      digest: encodedData.digest,
    });

    this.sendHeader();
  }

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
        if (!this.state.isAudioAckMode) { 
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
    return `!${this.state.dataPackets.length}|${file.name}|${file.type}|${file.size}|${this.state.selectedEncoding}|${this.state.digest}|${RECEIVER_AUDIO_COOLDOWN}`;
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
    
    if (this.state.isAudioAckMode && this.state.currentPacketNumber >= this.state.dataPackets.length-1) return;

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
    let totalNumberOfPackets = Math.ceil(data.length / this.state.eachPacketSize);
    for (let i = 0; i < totalNumberOfPackets; i++) {
      let curData = data.substring(i * this.state.eachPacketSize, i * this.state.eachPacketSize + this.state.eachPacketSize);
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

  calculateDataFrameSize() {
    console.log('selectedQRCodeVersion', this.state.selectedQRCodeVersion);
    let packetSize = 100;
    switch(this.state.selectedQRCodeErrorCorrectionLevel) {
      case 'L': {
        packetSize = this.state.selectedEncoding == DataEncodingType.base45
          ? QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.L
          : QRCodeVersions[this.state.selectedQRCodeVersion].binary.L
        break;
      }
      case 'M': {
        packetSize = this.state.selectedEncoding == DataEncodingType.base45
          ? QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.M
          : QRCodeVersions[this.state.selectedQRCodeVersion].binary.M
        break;
      }
      case 'Q': {
        packetSize = this.state.selectedEncoding == DataEncodingType.base45
          ? QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.Q
          : QRCodeVersions[this.state.selectedQRCodeVersion].binary.Q
        break;
      }
      case 'H': {
        packetSize = this.state.selectedEncoding == DataEncodingType.base45
          ? QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.H
          : QRCodeVersions[this.state.selectedQRCodeVersion].binary.H
        break;
      }
    }
    let dataPacketSize = packetSize - DATA_FRAME_OVERHEAD_CHARACTERS;
    console.log('dataPacketSize', dataPacketSize);
    this.setState({ eachPacketSize : dataPacketSize });
    this.sendHeader();
  }

  onChangeSelectedEncoding = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    if (value == null) return;
    this.setState({ selectedEncoding: value });
    setTimeout(() => this.calculateDataFrameSize(), 100);
    setTimeout(() => this.decodeFile(), 150);
  }
  
  onChangeSelectedQRCodeVersion = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    if (value == null) return;
    this.setState({ selectedQRCodeVersion: value });
    setTimeout(() => this.calculateDataFrameSize(), 100);
  }

  onChangeSelectedQRCodeErrorCorrectionLevel = (event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
    if (value == null) return;
    this.setState({ selectedQRCodeErrorCorrectionLevel: value });
    setTimeout(() => this.calculateDataFrameSize(), 100);
  }

  onChangeIsAudioAckMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isAudioAckMode: event.target.checked });
  }

  onChangeTick = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value !== 'number') return;
    this.setState({ tick: value });
  }

  render() {
    return <Container maxWidth="sm" style={{ paddingBottom: '75px' }}>
      <h3>SonicQR Sender</h3>

      <h4>QR Code Version</h4>
      <ToggleButtonGroup size="small" value={this.state.selectedQRCodeVersion} exclusive onChange={this.onChangeSelectedQRCodeVersion} style={{display: 'flex', flexWrap: 'wrap'}}>
        {QRCodeVersions.map((x, i) => <ToggleButton style={{ flex: '1 1 10%' }} value={i}>{x.label}</ToggleButton> )}
      </ToggleButtonGroup>
      <Grid container>
        <Grid item xs={12} sm={6} style={{marginTop: '10px'}}>
          <h4>QR Code Error Correction Level</h4>
          <ToggleButtonGroup size="small" value={this.state.selectedQRCodeErrorCorrectionLevel} exclusive onChange={this.onChangeSelectedQRCodeErrorCorrectionLevel}>
            {QRCodeErrorCorrectionLevel.map((x, i) => <ToggleButton style={{ width: '51px'}} value={x}>{x}</ToggleButton> )}
          </ToggleButtonGroup>
          <div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base45 && this.state.selectedQRCodeErrorCorrectionLevel === 'L') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.L}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base45 && this.state.selectedQRCodeErrorCorrectionLevel === 'M') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.M}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base45 && this.state.selectedQRCodeErrorCorrectionLevel === 'Q') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.Q}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base45 && this.state.selectedQRCodeErrorCorrectionLevel === 'H') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].alphaNumeric.H}</div>
          </div>
          <div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base64 && this.state.selectedQRCodeErrorCorrectionLevel === 'L') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].binary.L}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base64 && this.state.selectedQRCodeErrorCorrectionLevel === 'M') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].binary.M}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base64 && this.state.selectedQRCodeErrorCorrectionLevel === 'Q') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].binary.Q}</div>
            <div className={(this.state.selectedEncoding === DataEncodingType.base64 && this.state.selectedQRCodeErrorCorrectionLevel === 'H') ? "qrcode-ec-label selected" : "qrcode-ec-label"}>{QRCodeVersions[this.state.selectedQRCodeVersion].binary.H}</div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} style={{marginTop: '10px'}}>
          <h4>File Encoding</h4>
          <ToggleButtonGroup size="small" value={this.state.selectedEncoding} exclusive onChange={this.onChangeSelectedEncoding}>
            <ToggleButton value="Base45"> Base45 </ToggleButton>
            <br /><br />
            <ToggleButton value="Base64"> Base64 </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <br />
      
      <input type="file" onChange={this.onFileChange} style={{ display: 'none' }} id="raised-button-file"/>
      <label htmlFor="raised-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload File
        </Button>
      </label>
      <div style={{display: 'inline-block', paddingLeft: '20px', fontSize: '0.8em'}}>{this.state.selectedFile?.name}</div>
      <div style={{display: 'inline-block', paddingLeft: '10px', fontSize: '0.6em'}}>{(this.state.selectedFile) ? (this.state.selectedFile.size/1024).toFixed(2) + ' KB' : ''}</div>
      <br />
      <br />
      
      {this.state ? <Box>
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
        <Box alignItems="center" className='animate-left-right' style={{backgroundColor: 'white', padding: 10, width: "60vmin", height: "60vmin"}}>
          { this.state.currentPacketData != null ? <QRCode value={this.state.currentPacketData} renderAs='svg' level="L" bgColor="#FFFFFFFF" style={{width: "100%", height: "100%"}} /> : null }
        </Box>
      </Box>: null}
      <Button variant="contained" color="primary" onClick={this.sendHeader}>Header</Button>
      {this.state.transferState == SenderTransferState.SENDING_DATA_PACKETS ? 
      <Button variant="contained" color="secondary" onClick={this.stop}>Stop</Button>:
      <Button variant="contained" color="primary" onClick={this.sendData}>Start</Button>
      }
      <FormControlLabel
        style={{marginLeft: '10px'}}
        control={
        <Switch
          checked={this.state.isAudioAckMode}
          onChange={this.onChangeIsAudioAckMode}
          name="Audio Ack Mode"/>}
        label="Require Audio Acknowledge" />
      {/* <ToggleButtonGroup size="small" value={this.state.tick} exclusive onChange={this.onChangeTick} style={{marginTop: '10px'}}>
        <ToggleButton value={5}> 5 </ToggleButton>
        <ToggleButton value={10}> 10 </ToggleButton>
        <ToggleButton value={15}> 15 </ToggleButton>
        <ToggleButton value={20}> 20 </ToggleButton>
        <ToggleButton value={25}> 25 </ToggleButton>
        <ToggleButton value={30}> 30 </ToggleButton>
      </ToggleButtonGroup> */}

      <Typography id="discrete-slider" gutterBottom>
        Tick {this.state.tick} ms
      </Typography>
      <Slider
        value={this.state.tick}
        onChange={this.onChangeTick}
        step={5}
        min={5}
        max={500}
      />
    </Container>;
  }
}

export default Sender;