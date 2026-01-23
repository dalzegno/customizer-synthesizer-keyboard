export const createNoteWithFrequencySlider = (audioContext: AudioContext) => {
  type PlayerStatus = "paused" | "playing";
  let status: PlayerStatus = "paused";

  let gainNode: GainNode = audioContext.createGain();
  let oscillatorNode: OscillatorNode = audioContext.createOscillator();
  let maxGainVolume = 0.5;

  const container = document.createElement("article");
  container.style.backgroundColor = "orangered";

  const frequencySlider = document.createElement("input") as HTMLInputElement;
  frequencySlider.classList.add("frequency-slider");
  frequencySlider.type = "range";
  frequencySlider.max = "20000";
  frequencySlider.min = "0";
  frequencySlider.value = "432";
  frequencySlider.width = 100;
  frequencySlider.style.width = "90%";
  const frequencyLabel = document.createElement("p") as HTMLElement;
  frequencyLabel.textContent = `frequency: ${frequencySlider.value}Hz`;

  const waveformTypeSelect = document.createElement(
    "select",
  ) as HTMLSelectElement;
  const options = ["sine", "sawtooth", "square", "triangle"];
  options.forEach((option) => {
    const opt = document.createElement("option") as HTMLOptionElement;
    opt.value = option;
    opt.textContent = option;
    waveformTypeSelect.append(opt);
  });
  waveformTypeSelect.onchange = () => {
    oscillatorNode.type = <OscillatorType>waveformTypeSelect.value;
  };

  const btnPlay = document.createElement("button");
  btnPlay.textContent = "paused";

  btnPlay.onclick = () => {
    const now = audioContext.currentTime;
    if (status === "paused") {
      status = "playing";
      btnPlay.textContent = "playing";

      gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, 0);
      gainNode.gain.linearRampToValueAtTime(maxGainVolume, now + 0.2);
      oscillatorNode = audioContext.createOscillator();
      oscillatorNode.type = <OscillatorType>waveformTypeSelect.value;
      oscillatorNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      let frequencySliderValue = Number(frequencySlider.value);

      oscillatorNode.frequency.setValueAtTime(frequencySliderValue, now);
      oscillatorNode.start();
    } else {
      status = "paused";
      btnPlay.textContent = "paused";
      gainNode.gain.setValueAtTime(maxGainVolume, 0);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
      oscillatorNode.stop(now + 0.1);
    }
  };

  frequencySlider.oninput = () => {
    const now = audioContext.currentTime;
    frequencyLabel.textContent = `frequency: ${frequencySlider.value}Hz`;
    let frequencySliderValue = Number(frequencySlider.value);
    oscillatorNode.frequency.setValueAtTime(frequencySliderValue, now);
  };

  container.append(
    btnPlay,
    waveformTypeSelect,
    frequencyLabel,
    frequencySlider,
  );

  document.body.prepend(container);
};
