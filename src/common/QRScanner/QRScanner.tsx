import { Component, createRef } from "react"
import './QRScanner.css';

type QRScannerProps = typeof QRScanner.defaultProps & {
  debounceTimeoutInMs: number,
  processImageIntervalInMs: number,
  messageChange?: Function,
}

type QRScannerState = {
  debounceTimeoutInMs: number,
  processImageIntervalInMs: number,
  decoded_string: '',
}

class QRScanner extends Component<QRScannerProps, QRScannerState> {

  static defaultProps = { 
    debounceTimeoutInMs: 750,
    processImageIntervalInMs: 16,
  };

  video = createRef<HTMLVideoElement>();
  canvas = createRef<HTMLCanvasElement>();

  isStreamInit = false;
  constraints = {
    audio: false,
    video: {
      facingMode: 'environment'
    }
  };

  // In milliseconds
  debounceTimeoutInMs: number;
  processImageIntervalInMs: number;

  decoder: Worker;
  lastScannedEpochInMs: number;
  lastScannedAtEpochInMs: number;

  processQRCode: Boolean;

  constructor(props: QRScannerProps) {
    super(props);
    
    this.debounceTimeoutInMs = props.debounceTimeoutInMs; 
    this.processImageIntervalInMs = props.processImageIntervalInMs;
    
    // quirc wasm
    this.decoder = new Worker('./lib/quirc/quirc-worker.js');
    this.lastScannedEpochInMs = new Date().getTime();
    this.lastScannedAtEpochInMs = new Date().getTime();

    this.processQRCode = true;
    setTimeout(() => this.attemptQRDecode(), this.debounceTimeoutInMs);
    this.decoder.onmessage = (msg) => { this.onDecoderMessage(msg) };
  }

  async componentDidMount() {
    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
    } catch (err) {
      this.handleError(err);
    }
  }

  componentWillUnmount() {
    if (this.decoder) {
      this.processQRCode = false;
      this.decoder.terminate();
    }
  }

  attemptQRDecode() {
    if (this.isStreamInit)  {
      setTimeout(() => { this.attemptQRDecode() }, this.processImageIntervalInMs);
      try {
        if (this.canvas === null || this.canvas.current === null) return;
        if (this.video === null || this.video.current === null) return;

        let canvas_context = this.canvas.current.getContext("2d");
        if (canvas_context === null) return;

        this.canvas.current.width = this.video.current.videoWidth;
        this.canvas.current.height = this.video.current.videoHeight;
        canvas_context.drawImage(this.video.current, 0, 0, this.canvas.current.width, this.canvas.current.height);
  
        var imgData = canvas_context.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height);
  
        if (imgData.data) {
          this.decoder.postMessage(imgData);
        }
      } catch (err) {
        //if (err.name === 'NS_ERROR_NOT_AVAILABLE') setTimeout(() => { this.attemptQRDecode() }, this.processImageIntervalInMs);
        console.log("Error");
        console.log(err);
      }
    }
  }

  onDecoderMessage(msg: any) {
    if (msg.data !== 'done') {
  
      const qrid = msg.data['payload_string'];
      const right_now = Date.now();
  
      if (qrid !== this.lastScannedEpochInMs || this.lastScannedAtEpochInMs < right_now - this.debounceTimeoutInMs) {
        this.lastScannedEpochInMs = qrid;
        this.lastScannedAtEpochInMs = right_now;

        if (this.props.messageChange) {
          this.props.messageChange(qrid);
        }
        this.setState({ decoded_string: qrid });
      } else if (qrid === this.lastScannedEpochInMs) {
        this.lastScannedAtEpochInMs = right_now;
      }
    }
  }

  handleSuccess(stream: any) {
    if (this.video && this.video.current) {
      this.video.current.srcObject = stream;
      this.isStreamInit = true;
    }
  }

  handleError(error: Error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  render() {
    return (
      <div>
        <div className="video-container">
          <video playsInline autoPlay ref={this.video}></video>
        </div>
        <canvas
          id="qr-canvas"
          ref={this.canvas}
          className="qrcode-canvas"></canvas>
      </div>
    )
  }
}

export default QRScanner