import ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App.jsx'

(function () {
  
  const wrapper = document.getElementById('app')
  console.log(wrapper)
  ReactDOM.render(<App/>, wrapper)      

  // function play() {
  //   const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);

  //   music_rnn
  //     .continueSequence(qns, rnn_steps, rnn_temperature)
  //     .then(sample => {
  //       const vizualizer = new mm.Visualizer(sample, document.getElementById('canvas'), config)
  //       const vizPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus', Tone.Master, new Map(), new Map(), {
  //         run: (note) => vizualizer.redraw(note),
  //         stop: () => { console.log('done') }
  //       })

  //       vizPlayer.start(sample)
  //     })
  // }

  // play();
})();
