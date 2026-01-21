import { Note } from "../models/Note.js";
import { saveNotes } from "../utils/storage.js";
import { renderNotes } from "./noteList.js";

export const loadAddNoteModal = (noteList: Note[]) => {
  const dialog = document.querySelector(
    "#add-note-dialog",
  ) as HTMLDialogElement;
  const openBtn = document.querySelector(
    "#open-modal-btn",
  ) as HTMLButtonElement;
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
  const waveformTypeInput = document.querySelector(
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
    const waveformType = waveformTypeInput.value;

    const newNote: Note = {
      id: Date.now(),
      name: noteName,
      frequency: frequency,
      waveformType: waveformType,
    };

    noteList.push(newNote);

    saveNotes(noteList);
    renderNotes("#noteCard-container", noteList);

    addForm.reset();
    dialog.close();
  });
};
