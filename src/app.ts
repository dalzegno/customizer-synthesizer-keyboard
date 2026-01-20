import { Note } from "./interfaces/Note";
import { ADSR } from "./interfaces/ADSR";
import { Analyser } from "./analyser/analyserHelper.js";
import { PlayNoteHelper } from "./audio/playNoteHelper.js";
//#region Load Audio Context stuff

const audioContext = new AudioContext();

const analyserHelper = new Analyser();
const noteHelper = new PlayNoteHelper(audioContext);

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
const primaryGainControl = audioContext.createGain();
primaryGainControl.gain.setValueAtTime(0.5, 0);
primaryGainControl.connect(audioContext.destination);

//#endregion
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

function createPlayNoteKeyEventLister(keyCode: string, frequency: number) {
  let attackTimeInput = document.querySelector(
    "#attackTime",
  ) as HTMLInputElement;
  let decayTimeInput = document.querySelector("#decayTime") as HTMLInputElement;
  let sustainLevelInput = document.querySelector(
    "#sustainLevel",
  ) as HTMLInputElement;
  let releaseTimeInput = document.querySelector(
    "#releaseTime",
  ) as HTMLInputElement;

  let adsr: ADSR = {
    attackTime: +attackTimeInput.value,
    decayTime: +decayTimeInput.value,
    sustainLevel: +sustainLevelInput.value,
    releaseTime: +releaseTimeInput.value,
  };

  const analyser = audioContext.createAnalyser();
  analyserHelper.createOscilloscope(analyser);

  let noteGain = audioContext.createGain();

  let noteOscillator = audioContext.createOscillator();
  let now = audioContext.currentTime;

  document.body.addEventListener("keydown", (e) => {
    let adsr: ADSR = {
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

      let noteGainAndOscillator = noteHelper.startNote(frequency, adsr, "sine");
      noteGain = noteGainAndOscillator[0];
      noteOscillator = noteGainAndOscillator[1];

      noteOscillator.connect(analyser);
      noteOscillator.connect(analyserAll);

      noteGain.connect(primaryGainControl);
    }
  });

  document.body.addEventListener("keyup", (e) => {
    let adsr: ADSR = {
      attackTime: +attackTimeInput.value,
      decayTime: +decayTimeInput.value,
      sustainLevel: +sustainLevelInput.value,
      releaseTime: +releaseTimeInput.value,
    };
    if (e.code === keyCode) {
      noteHelper.stopNote(noteGain, noteOscillator, adsr, now);
    }
  });
}

const keys: string[] = [
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

const noteList: Note[] = [];

// #region Add Note Modal
const dialog = document.querySelector("#add-note-dialog") as HTMLDialogElement;
const openBtn = document.querySelector("#open-modal-btn") as HTMLButtonElement;
const closeBtn = document.querySelector(
  "#close-modal-btn",
) as HTMLButtonElement;
const addForm = document.querySelector("#add-note-form") as HTMLFormElement;

const noteNameInput = document.querySelector(
  "#notename-input",
) as HTMLInputElement;
const frequencyInput = document.querySelector(
  "#frequency-input",
) as HTMLInputElement;
const noteTypeInput = document.querySelector(
  "#note-type-select",
) as HTMLSelectElement;

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const noteName = noteNameInput.value;
  const frequency = +frequencyInput.value;
  const noteType = noteTypeInput.value;

  const newNote: Note = {
    id: Date.now(),
    name: noteName,
    frequency: frequency,
    type: noteType,
  };

  noteList.push(newNote);

  saveToLocalStorage();
  renderNotes();

  addForm.reset();
  dialog.close();
});

//#endregion

//#region Render NoteList
const noteCardContainer = document.querySelector(".noteCard-container");
function renderNotes() {
  if (noteCardContainer) {
    noteCardContainer.replaceChildren();
  }

  noteList.forEach(({ id, name, frequency, type }) => {
    const card = document.createElement("article");
    card.classList.add("note-card");

    card.dataset.id = id.toString();

    const titleElement = document.createElement("h3");
    titleElement.textContent = name;

    const frequencyElement = document.createElement("span");
    frequencyElement.textContent = frequency.toString();
    card.dataset.frequency = frequency.toString();

    const waveformElement = document.createElement("p");
    console.log("type: " + type);
    waveformElement.textContent = type;
    card.dataset.waveformType = type;

    const sustainCheckboxElement = document.createElement("input");
    sustainCheckboxElement.type = "checkbox";
    sustainCheckboxElement.classList.add("sustainInput");

    const removeElement = document.createElement("button");
    removeElement.textContent = "remove";
    removeElement.classList.add("btn-remove-note");

    card.append(
      titleElement,
      frequencyElement,
      waveformElement,
      sustainCheckboxElement,
      removeElement,
    );

    if (noteCardContainer) {
      const currentActive = document.querySelector(".note-card.active");
      if (currentActive) {
        currentActive.classList.remove("active");
      }
      card.classList.add("active");

      noteCardContainer.append(card);
    }
  });
}
//#endregion
/* function playNoteOnce() {
  if (noteCardContainer) {
    noteCardContainer.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;

      const card = target.closest(".note-card") as HTMLElement;
      console.log(card);
      if (!card) {
        return;
      }

      const frequencyStr = card.dataset.frequency;
      console.log(frequencyStr);
      if (frequencyStr) {
        const frequency = Number(frequencyStr);

        const now = audioContext.currentTime;
        let adsr = getADSR();
        let noteGainAndOscillator = noteHelper.startNote(
          frequency,
          adsr,
          "sine",
        );

        let noteGain = noteGainAndOscillator[0];
        let noteOscillator = noteGainAndOscillator[1];

        const analyser = audioContext.createAnalyser();
        analyserHelper.createOscilloscope(analyser);

        noteOscillator.connect(analyser);
        noteGain.connect(primaryGainControl);

        noteHelper.stopNote(noteGain, noteOscillator, adsr, now);
      }
    });
  }
} */
//playNoteOnce();
function playNoteSustain() {
  if (noteCardContainer) {
    let noteOscillator: OscillatorNode;
    let noteGain: GainNode = audioContext.createGain();
    let now: number = 0;
    let sustainChecked: boolean = false;

    noteCardContainer.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;
      console.log(target);
      const card = target.closest(".note-card") as HTMLElement;
      console.log(card);

      if (!card) {
        return;
      }
      if (target.classList.contains("btn-remove-note")) {
        let elementToRemove = noteList.find(
          (note) => note.id.toString() === card.dataset.id,
        ) as Note;
        console.log("remove: " + elementToRemove);
        noteList.splice(noteList.indexOf(elementToRemove), 1);
        saveToLocalStorage();
        renderNotes();
        return;
      }

      const sustainCheckboxElement = card.querySelector(
        ".sustainInput",
      ) as HTMLInputElement;

      console.log("helloooo: " + sustainCheckboxElement);

      const frequencyStr = card.dataset.frequency;
      const waveformType = card.dataset.waveformType;
      console.log(frequencyStr);
      if (frequencyStr && waveformType) {
        const frequency = Number(frequencyStr);

        let adsr = getADSR();
        let noteGainAndOscillatorAndStartTime = noteHelper.startNote(
          frequency,
          adsr,
          waveformType,
        );

        noteGain = noteGainAndOscillatorAndStartTime[0];
        noteOscillator = noteGainAndOscillatorAndStartTime[1];
        now = noteGainAndOscillatorAndStartTime[2];

        //const analyser = audioContext.createAnalyser();
        //analyserHelper.createOscilloscope(analyser);

        noteOscillator.connect(analyserAll);
        noteGain.connect(primaryGainControl);

        sustainChecked = sustainCheckboxElement.checked;
        if (!sustainChecked) {
          noteHelper.stopNote(noteGain, noteOscillator, adsr, now);
          return;
        }
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (sustainChecked) {
        let adsr = getADSR();
        noteHelper.stopNote(noteGain, noteOscillator, adsr, now);
      }
    });
  }
}
playNoteSustain();

function getADSR(): ADSR {
  let attackTimeInput = document.querySelector(
    "#attackTime",
  ) as HTMLInputElement;
  let decayTimeInput = document.querySelector("#decayTime") as HTMLInputElement;
  let sustainLevelInput = document.querySelector(
    "#sustainLevel",
  ) as HTMLInputElement;
  let releaseTimeInput = document.querySelector(
    "#releaseTime",
  ) as HTMLInputElement;
  let adsr: ADSR = {
    attackTime: +attackTimeInput.value,
    decayTime: +decayTimeInput.value,
    sustainLevel: +sustainLevelInput.value,
    releaseTime: +releaseTimeInput.value,
  };

  return adsr;
}

const saveToLocalStorage = () => {
  // Detta kallas för Serialisering: Objekt -> JSON-sträng
  const jsonString = JSON.stringify(noteList);
  localStorage.setItem("myNoteList", jsonString);
};

const loadFromLocalStorage = () => {
  const storedData = localStorage.getItem("myNoteList");

  if (storedData) {
    // Detta kallas för deserialisering: JSON-sträng -> Objekt
    const parsedData = JSON.parse(storedData) as Note[]; // Type Assertion (as Song[]) för att göra TypeScript glad

    // Töm standardlistan och fyll på med den sparade
    noteList.length = 0;
    noteList.push(...parsedData);
  }
};

loadFromLocalStorage();
renderNotes();
