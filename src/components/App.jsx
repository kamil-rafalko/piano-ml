import React, { Component } from 'react'
import * as mm from '@magenta/music';
// var Tone = require("tone"); // TODO jak to inaczej zaimportować?
import Tone from 'tone'
// var elerem = require('electron').remote;
// var dialog = elerem.dialog;
// var app = elerem.app;

// var http = require('http');
// var fs = require('fs');
// var path = require('path');

// var remote = require('electron').remote;
// var fs = remote.require('fs');

// import remote from 'electron'
// const fs = remote.require('fs')

import fs from 'fs'

class App extends Component {

  constructor() {
    super()
    const TWINKLE_TWINKLE = {
      notes: [
        { pitch: 42, startTime: 0.0, endTime: 0.5 },
        { pitch: 60, startTime: 0.5, endTime: 1.0 },
        { pitch: 61, startTime: 1.0, endTime: 1.5 },
        { pitch: 67, startTime: 1.5, endTime: 2.0 },
        { pitch: 71, startTime: 2.0, endTime: 2.5 },
        { pitch: 70, startTime: 2.5, endTime: 3.0 },
        { pitch: 74, startTime: 3.0, endTime: 4.0 },
        { pitch: 67, startTime: 3.0, endTime: 4.0 },
        { pitch: 65, startTime: 4.0, endTime: 4.5 },
        { pitch: 65, startTime: 4.5, endTime: 5.0 },
        { pitch: 62, startTime: 5.0, endTime: 5.5 },
        { pitch: 67, startTime: 5.5, endTime: 6.0 },
        { pitch: 62, startTime: 6.0, endTime: 6.5 },
        { pitch: 62, startTime: 6.5, endTime: 7.0 },
        { pitch: 63, startTime: 7.0, endTime: 8.0 },
        { pitch: 78, startTime: 8.0, endTime: 10.0 },
      ],
      totalTime: 8
    }

    const DRUMS = {
      notes: [
        { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
        { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
        { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
        { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
        { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
        { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
        { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
        { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
        { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
      ],
      quantizationInfo: { stepsPerQuarter: 4 },
      tempos: [{ time: 0, qpm: 150 }],
      totalQuantizedSteps: 44
    };

    // const player = new mm.Player()
    // const soundFontPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus')
    // player.start(TWINKLE_TWINKLE)

    // console.log("dsadasdsadsad1")
    // console.log(document.getElementById('canvas'))

    const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
    music_rnn.initialize()

    const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);

    this.state = { noteSequence: qns }

    const model = new mm.Coconet('https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach');
    model.initialize()
    .then(() => {
        console.time('a')
        model.infill(qns, {
          temperature: 0.99
        })
          .then(output => { 
            this.setState({ noteSequence: output }) 
            console.log("State initialized!")
            console.timeEnd('a')
          })
      })
  }


  play() {
    const config = {
      noteHeigh: 6,
      pixelsPerTimeStep: 30,
      noteSpacing: 1,
      noteRGB: '120, 41, 64',
      activeNoteRGB: '240, 84, 119'
    }
    console.log(this.state.noteSequence)
    const vizualizer = new mm.Visualizer(mm.sequences.mergeConsecutiveNotes(this.state.noteSequence), document.getElementById('canvas'), config)
    const vizPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus', Tone.Master, new Map(), new Map(), {
      run: (note) => vizualizer.redraw(note),
      stop: () => { console.log('done') }
    })
    vizPlayer.start(mm.sequences.mergeConsecutiveNotes(this.state.noteSequence))
    // vizPlayer.start(this.state.noteSequence)
    // vizPlayer.start(TWINKLE_TWINKLE)
  }

  save() {
    const seq = mm.sequences.mergeConsecutiveNotes(this.state.noteSequence)
    // const seq = this.state.noteSequence
    const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus')

    console.log(player.getAudioNodeOutput(seq))

    fs.writeFile("/Users/kamil.rafalko/temp/bach.mid", mm.sequenceProtoToMidi(seq), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("File succesfully saved to disk.");
    })
    // saveAs();

    // var toLocalPath = path.resolve(app.getPath("desktop"), 'bach.mid') 

    // var userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath });

    // if(userChosenPath){
    //     download (new File([mm.sequenceProtoToMidi(seq)], 'bach.mid'), userChosenPath, myUrlSaveAsComplete)
    // }
  }

//   download (url, dest, cb) {
//     var file = fs.createWriteStream(dest);
//     var request = http.get(url, function(response) {
//         response.pipe(file);
//         file.on('finish', function() {
//             file.close(cb); // close() is async, call cb after close completes.
//         });
//     }).on('error', function(err) { // Handle errors
//         fs.unlink(dest); // Delete the file async. (But we don't check the result)
//         if (cb) cb(err.message);
//     });
// }

  render() {
    return (
      <div>
        <button onClick={() => this.play()}>Play</button>
        <button onClick={() => this.save()}>Save</button>
      </div>
    )
  }
}

export default App