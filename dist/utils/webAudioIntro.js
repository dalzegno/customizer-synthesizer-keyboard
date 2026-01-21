"use strict";
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
