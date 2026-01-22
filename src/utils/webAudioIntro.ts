/* 
const audioContext = new AudioContext();

const analyserHelper = new AnalyserService();
const noteHelper = new PlayNoteService(audioContext);

const SAMPLE_RATE = audioContext.sampleRate;
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
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.5, 0);
primaryGainControl.connect(audioContext.destination);
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

document.body.appendChild(button); */
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
