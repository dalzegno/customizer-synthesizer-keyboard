import { Analyser } from "./analyser/analyserHelper.js";
import { PlayNoteHelper } from "./audio/playNoteHelper.js";
const analyserHelper = new Analyser();
const noteHelper = new PlayNoteHelper();
//#region Load Audio Context stuff
const audioContext = new AudioContext();
const SAMPLE_RATE = audioContext.sampleRate;
console.log(SAMPLE_RATE);
const timeLength = 1; // measured in seconds
const buffer = audioContext.createBuffer(1, SAMPLE_RATE * timeLength, SAMPLE_RATE);
const channelData = buffer.getChannelData(0);
// Float32Array {0: 0, 1: 0, ...}
for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
}
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.5, 0);
primaryGainControl.connect(audioContext.destination);
/*


*/
//#region intro
/*
const whiteNoiseSource = audioContext.createBufferSource();
whiteNoiseSource.buffer = buffer;


whiteNoiseSource.connect(primaryGainControl);
const button = document.createElement("button");
button.innerText = "White Noise";

button.addEventListener("click", () => {
  const whiteNoiseSource = audioContext.createBufferSource();
  whiteNoiseSource.buffer = buffer;
  whiteNoiseSource.connect(primaryGainControl);

  whiteNoiseSource.start();
});

document.body.appendChild(button);
/*
document.body.addEventListener("keyup", (e) => {
  if (e.code === "KeyQ") {
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.connect(primaryGainControl);

    whiteNoiseSource.start();
  }
}); */
/*
const snareFilter = audioContext.createBiquadFilter();
snareFilter.type = "highpass";
snareFilter.frequency.value = 1500; // Measured in Hz
snareFilter.connect(primaryGainControl);

// ...
const snareButton = document.createElement("button");
snareButton.innerText = "Snare";
snareButton.addEventListener("click", () => {
  const whiteNoiseSource = audioContext.createBufferSource();
  whiteNoiseSource.buffer = buffer;
  whiteNoiseSource.connect(snareFilter);

  whiteNoiseSource.start();
});
document.body.appendChild(snareButton);

const kickButton = document.createElement("button");
kickButton.innerText = "Kick";
kickButton.addEventListener("click", () => {
  const kickOscillator = audioContext.createOscillator();
  // Frequency in Hz. This corresponds to a C note.
  kickOscillator.frequency.setValueAtTime(442, 0);
  kickOscillator.connect(primaryGainControl);
  kickOscillator.start();
});
document.body.appendChild(kickButton);
*/
//#endregion
/*


*/
const analyserAll = audioContext.createAnalyser();
analyserHelper.createOscilloscope(analyserAll);
function createPlayNoteKeyEventLister(keyCode, frequency) {
    let attackTimeInput = document.querySelector("#attackTime");
    let decayTimeInput = document.querySelector("#decayTime");
    let sustainLevelInput = document.querySelector("#sustainLevel");
    let releaseTimeInput = document.querySelector("#releaseTime");
    const analyser = audioContext.createAnalyser();
    analyserHelper.createOscilloscope(analyser);
    let adsr = {
        attackTime: +attackTimeInput.value,
        decayTime: +decayTimeInput.value,
        sustainLevel: +sustainLevelInput.value,
        releaseTime: +releaseTimeInput.value,
    };
    let noteGain = audioContext.createGain();
    let noteOscillator = audioContext.createOscillator();
    let now = audioContext.currentTime;
    document.body.addEventListener("keydown", (e) => {
        let adsr = {
            attackTime: +attackTimeInput.value,
            decayTime: +decayTimeInput.value,
            sustainLevel: +sustainLevelInput.value,
            releaseTime: +releaseTimeInput.value,
        };
        if (e.code === keyCode) {
            if (e.repeat) {
                return;
            }
            now = audioContext.currentTime;
            let noteGainAndOscillator = noteHelper.startNote(audioContext, frequency, adsr);
            noteGain = noteGainAndOscillator[0];
            noteOscillator = noteGainAndOscillator[1];
            noteOscillator.connect(analyser);
            noteOscillator.connect(analyserAll);
            noteGain.connect(primaryGainControl);
        }
    });
    document.body.addEventListener("keyup", (e) => {
        let adsr = {
            attackTime: +attackTimeInput.value,
            decayTime: +decayTimeInput.value,
            sustainLevel: +sustainLevelInput.value,
            releaseTime: +releaseTimeInput.value,
        };
        if (e.code === keyCode) {
            noteHelper.stopNote(audioContext, noteGain, noteOscillator, adsr, now);
        }
    });
}
const keys = [
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "KeyA",
    "KeyS",
    "KeyD",
];
//just intonation ratios
const ratios = [
    1,
    (1 / 15) * 16,
    (1 / 8) * 9,
    (1 / 5) * 6,
    (1 / 4) * 5,
    (1 / 3) * 4,
    (1 / 32) * 45,
    (1 / 2) * 3,
    (1 / 5) * 8,
    (1 / 3) * 5,
    (1 / 5) * 9,
    (1 / 8) * 15,
    1 * 2,
];
let startFrequency = 216;
let i = 0;
for (const key of keys) {
    let frequency = startFrequency * ratios[i];
    createPlayNoteKeyEventLister(key, frequency);
    i++;
}
/* const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const WIDTH = 1000;
const HEIGHT = 500;
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);


function draw() {
  const drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  // Fill solid color
  canvasCtx.fillStyle = "rgb(200 200 200)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  // Begin the path
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0 0 0)";
  canvasCtx.beginPath();
  // Draw each point in the waveform
  const sliceWidth = WIDTH / bufferLength;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (HEIGHT / 2);

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  // Finish the line
  canvasCtx.lineTo(WIDTH, HEIGHT / 2);
  canvasCtx.stroke();
}
draw();
 */
// Connect the source to be analyzed
// source.connect(analyser);
// Get a canvas defined with ID "oscilloscope"
