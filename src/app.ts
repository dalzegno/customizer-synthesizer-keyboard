import { Note } from "./models/Note";
import { ADSR } from "./models/ADSR";
import { AnalyserService } from "./services/analyserService.js";
import { PlayNoteService } from "./services/playNoteService.js";

import { renderNotes } from "./components/noteList.js";
import { saveNotes, loadNotes } from "./utils/storage.js";
import { ratiosJustIntonation } from "./models/tuningRatios.js";
import {
  getNoteList,
  getNoteListFromLocalStorage,
} from "./services/NoteService.js";
import { loadAddNoteModal } from "./components/addNoteModal.js";
//#region Load Audio Context stuff

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

//#endregion
//initiation
let noteList: Note[] = [];
const apiNotes = getNoteList();
const storedNotes = getNoteListFromLocalStorage();

if (storedNotes.length > 0) {
  noteList.push(...storedNotes);
} else {
  noteList.push(...apiNotes);

  saveNotes(noteList);
}

renderNotes("#noteCard-container", noteList);

loadAddNoteModal(noteList);

const analyserAll = audioContext.createAnalyser();
analyserHelper.createOscilloscope(analyserAll);

function createPlayNoteKeyEventLister(keyCode: string, frequency: number) {
  const analyser = audioContext.createAnalyser();
  analyserHelper.createOscilloscope(analyser);

  let noteGain = audioContext.createGain();
  let noteOscillator = audioContext.createOscillator();

  let now = audioContext.currentTime;

  document.body.addEventListener("keydown", (e) => {
    let adsr = getADSR();
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
    let adsr = getADSR();
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

let startFrequency = 216;
let i = 0;
for (const key of keys) {
  let frequency = startFrequency * ratiosJustIntonation[i];
  createPlayNoteKeyEventLister(key, frequency);
  i++;
}

//#region Render NoteList

renderNotes("#noteCard-container", noteList);
const noteCardContainer = document.querySelector(".noteCard-container");

function playNoteSustain() {
  if (noteCardContainer) {
    let noteOscillator: OscillatorNode;
    let noteGain: GainNode;
    let now: number = 0;
    let sustainChecked: boolean = false;

    noteCardContainer.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".note-card") as HTMLElement;

      if (!card) {
        return;
      }
      if (target.classList.contains("btn-remove-note")) {
        let elementToRemove = noteList.find(
          (note) => note.id.toString() === card.dataset.id,
        ) as Note;
        noteList.splice(noteList.indexOf(elementToRemove), 1);
        saveNotes(noteList);
        renderNotes("#noteCard-container", noteList);
        return;
      }

      const sustainCheckboxElement = card.querySelector(
        ".sustainInput",
      ) as HTMLInputElement;

      const frequencyStr = card.dataset.frequency;
      const waveformType = card.dataset.waveformType;
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
