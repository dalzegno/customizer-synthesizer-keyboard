export const createNoteWithFrequencySlider = (audioContext) => {
    let status = "paused";
    let gainNode = audioContext.createGain();
    let oscillatorNode = audioContext.createOscillator();
    const container = document.createElement("article");
    container.style.backgroundColor = "grey";
    const frequencySlider = document.createElement("input");
    frequencySlider.classList.add("frequency-slider");
    frequencySlider.type = "range";
    frequencySlider.max = "20000";
    frequencySlider.min = "0";
    frequencySlider.value = "440";
    frequencySlider.width = 100;
    frequencySlider.style.width = "100%";
    const frequencyLabel = document.createElement("p");
    frequencyLabel.textContent = `frequency: ${frequencySlider.value}Hz`;
    const waveformTypeSelect = document.createElement("select");
    const options = ["sine", "sawtooth", "square", "triangle"];
    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        waveformTypeSelect.append(opt);
    });
    waveformTypeSelect.onchange = () => {
        oscillatorNode.type = waveformTypeSelect.value;
    };
    const btnPlay = document.createElement("button");
    btnPlay.textContent = "paused";
    btnPlay.onclick = () => {
        if (status === "paused") {
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.5, 0);
            oscillatorNode = audioContext.createOscillator();
            oscillatorNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            status = "playing";
            const now = audioContext.currentTime;
            let frequencySliderValue = Number(frequencySlider.value);
            btnPlay.textContent = "playing";
            gainNode.gain.setValueAtTime(1, 0);
            oscillatorNode.frequency.setValueAtTime(frequencySliderValue, now);
            oscillatorNode.start();
        }
        else {
            status = "paused";
            btnPlay.textContent = "paused";
            oscillatorNode.stop();
        }
    };
    frequencySlider.oninput = () => {
        const now = audioContext.currentTime;
        frequencyLabel.textContent = `frequency: ${frequencySlider.value}Hz`;
        let frequencySliderValue = Number(frequencySlider.value);
        oscillatorNode.frequency.setValueAtTime(frequencySliderValue, now);
    };
    container.append(btnPlay, waveformTypeSelect, frequencyLabel, frequencySlider);
    document.body.prepend(container);
};
