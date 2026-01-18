import { Note } from "./interfaces/Note";
import Hello from "./hello.js";
let hello = new Hello();
hello.helloWorld();
//#region Load Audio Context stuff
const audioContext = new AudioContext();

const SAMPLE_RATE = audioContext.sampleRate;
console.log(SAMPLE_RATE);
const timeLength = 1; // measured in seconds

const buffer = audioContext.createBuffer(
  1,
  SAMPLE_RATE * timeLength,
  SAMPLE_RATE,
);
const channelData = buffer.getChannelData(0);
// Float32Array {0: 0, 1: 0, ...}
for (let i = 0; i < buffer.length; i++) {
  channelData[i] = Math.random() * 2 - 1;
}

const whiteNoiseSource = audioContext.createBufferSource();
whiteNoiseSource.buffer = buffer;

const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.5, 0);

whiteNoiseSource.connect(primaryGainControl);
primaryGainControl.connect(audioContext.destination);
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
let attackTimeInput = document.querySelector("#attackTime") as HTMLInputElement;
let decayTimeInput = document.querySelector("#decayTime") as HTMLInputElement;
let sustainLevelInput = document.querySelector(
  "#sustainLevel",
) as HTMLInputElement;
let releaseTimeInput = document.querySelector(
  "#releaseTime",
) as HTMLInputElement;

const analyserAll = audioContext.createAnalyser();
createOscilloscope(analyserAll);
function playNote(keyCode: string, frequency: number) {
  const analyser = audioContext.createAnalyser();
  createOscilloscope(analyser);
  document.body.addEventListener("keydown", (e) => {
    if (e.code === keyCode) {
      if (e.repeat) {
        return;
      }

      const now = audioContext.currentTime;
      const noteOscillator = audioContext.createOscillator();
      noteOscillator.type = "square";
      noteOscillator.frequency.setValueAtTime(frequency, now);

      const attackTime: number = +attackTimeInput.value;
      const decayTime: number = +decayTimeInput.value;
      const sustainLevel: number = +sustainLevelInput.value;
      const releaseTime: number = +releaseTimeInput.value;
      const duration = attackTime + decayTime + releaseTime;

      const noteGain = audioContext.createGain();
      noteGain.gain.setValueAtTime(0, 0);
      noteGain.gain.linearRampToValueAtTime(1, now + attackTime);
      noteGain.gain.linearRampToValueAtTime(
        sustainLevel,
        now + attackTime + decayTime,
      );

      noteOscillator.start();
      noteOscillator.connect(noteGain);

      noteOscillator.connect(analyser);
      noteOscillator.connect(analyserAll);

      noteGain.connect(primaryGainControl);
      document.body.addEventListener("keyup", (e) => {
        if (e.code === keyCode) {
          const nowReleased = audioContext.currentTime;
          if (nowReleased > now + attackTime + decayTime) {
            noteGain.gain.setValueAtTime(
              sustainLevel,
              now + duration - releaseTime,
            );
            noteGain.gain.linearRampToValueAtTime(0, nowReleased + releaseTime);
            noteOscillator.stop(nowReleased + releaseTime);
          } else {
            noteGain.gain.setValueAtTime(
              sustainLevel,
              now + duration - releaseTime,
            );
            noteGain.gain.linearRampToValueAtTime(0, now + duration);
            noteOscillator.stop(nowReleased + duration);
          }
        }
      });
    }
  });
}
// playNote("KeyW", 420);

const keys: string[] = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU"];
let startFrequency = 438;
for (const key of keys) {
  playNote(key, startFrequency);
  startFrequency += 8;
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

function createOscilloscope(analyser: AnalyserNode) {
  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  const canvas = document.createElement("canvas");
  document.body.append(canvas);
  // const canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
  const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // draw an oscilloscope of the current audio source

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200 200 200)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0 0 0)";

    canvasCtx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }

  draw();
}
