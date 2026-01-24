export const createNoteWithFrequencySlider = (audioContext, analyserNode) => {
    let status = "paused";
    let gainNode = audioContext.createGain();
    let oscillatorNode = audioContext.createOscillator();
    let maxGainVolume = 0.5;
    const container = document.createElement("article");
    container.style.backgroundColor = "orangered";
    const frequencySlider = document.createElement("input");
    frequencySlider.classList.add("frequency-slider");
    frequencySlider.type = "range";
    frequencySlider.max = "20000";
    frequencySlider.min = "0";
    frequencySlider.step = "0.1";
    frequencySlider.value = "432";
    frequencySlider.width = 100;
    frequencySlider.style.width = "90%";
    const frequencyLabel = document.createElement("p");
    frequencyLabel.textContent = `frequency: ${frequencySlider.value}Hz`;
    //#region frequency modifiers inputs
    //frequency max and min inputs
    const frequencyMinInput = document.createElement("input");
    frequencyMinInput.type = "Number";
    frequencyMinInput.max = "20000";
    frequencyMinInput.min = "0";
    frequencyMinInput.placeholder = "min hz";
    const frequencyMaxInput = document.createElement("input");
    frequencyMaxInput.type = "Number";
    frequencyMaxInput.max = "20000";
    frequencyMaxInput.min = "0";
    frequencyMaxInput.placeholder = "max hz";
    frequencyMinInput.addEventListener("focusout", () => {
        frequencySlider.min = frequencyMinInput.value.toString();
    });
    frequencyMaxInput.addEventListener("focusout", () => {
        frequencySlider.max = frequencyMaxInput.value.toString();
    });
    //slider step
    const frequencySliderStepInput = document.createElement("input");
    frequencySliderStepInput.type = "number";
    frequencySliderStepInput.placeholder = "slider step (ex. 0.1, 1)";
    frequencySliderStepInput.addEventListener("focusout", () => {
        frequencySlider.step = frequencySliderStepInput.value.toString();
    });
    //#endregion
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
        const now = audioContext.currentTime;
        if (status === "paused") {
            status = "playing";
            btnPlay.textContent = "playing";
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, 0);
            gainNode.gain.linearRampToValueAtTime(maxGainVolume, now + 0.2);
            oscillatorNode = audioContext.createOscillator();
            oscillatorNode.type = waveformTypeSelect.value;
            oscillatorNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            if (analyserNode) {
                oscillatorNode.connect(analyserNode);
            }
            let frequencySliderValue = Number(frequencySlider.value);
            oscillatorNode.frequency.setValueAtTime(frequencySliderValue, now);
            oscillatorNode.start();
        }
        else {
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
    //frequency number input
    const frequencyNumberInput = document.createElement("input");
    frequencyNumberInput.type = "number";
    frequencyNumberInput.placeholder = "frequency in hz";
    frequencyNumberInput.addEventListener("focusout", () => {
        const now = audioContext.currentTime;
        let frequencyNumberInputValue = Number(frequencyNumberInput.value);
        frequencyLabel.textContent = `frequency: ${frequencyNumberInputValue}Hz`;
        oscillatorNode.frequency.setValueAtTime(frequencyNumberInputValue, now);
        frequencySlider.value = frequencyNumberInput.value;
    });
    container.append(btnPlay, waveformTypeSelect, frequencyLabel, frequencyMinInput, frequencyMaxInput, frequencySliderStepInput, frequencyNumberInput, frequencySlider);
    document.body.prepend(container);
};
