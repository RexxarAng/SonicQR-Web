class BeepDetectionAudioWorkletProcessor extends AudioWorkletProcessor {
  
  #count = 0;
  #dt = new Date();
  
  process(inputs, outputs, parameters) {
      // console.log('inputs', inputs);
      // console.log('outputs', outputs);
      

      // inputs.forEach((channel) => {
      //   for (let i = 0; i < channel.length; i++) {
      //     // channel[i] = Math.random() * 2 - 1;
      //     console.log(`${i} | ${channel[i]}`);
      //   }
      // });

      let diff = new Date() - this.#dt;
      console.log(`${this.#count} - ${diff}`);

      // console.log(`${this.#count}`);
      this.#count++;
      this.#dt = new Date();
  
      return true;
    }
  }
  
  registerProcessor(
    'beep-detection-audio-worklet-processor',
    BeepDetectionAudioWorkletProcessor
  );
  