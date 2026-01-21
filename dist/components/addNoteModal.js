import { saveNotes } from "../utils/storage.js";
import { renderNotes } from "./noteList.js";
export const loadAddNoteModal = (noteList) => {
    const dialog = document.querySelector("#add-note-dialog");
    const openBtn = document.querySelector("#open-modal-btn");
    const closeBtn = document.querySelector("#close-modal-btn");
    const addForm = document.querySelector("#add-note-form");
    const noteNameInput = document.querySelector("#notename-input");
    const frequencyInput = document.querySelector("#frequency-input");
    const waveformTypeInput = document.querySelector("#note-type-select");
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
        const newNote = {
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
