import { Note } from "../models/Note.js";
import { NoteButtonElement } from "./NoteButtonElement.js";

export const renderNotes = (containerId: string, noteList: Note[]) => {
  const container = document.querySelector(`${containerId}`);
  if (!container) {
    return;
  }
  if (container) {
    container.replaceChildren();
  }

  noteList.forEach(({ id, name, frequency, waveformType, sustainChecked }) => {
    let card = NoteButtonElement(id, frequency, name, waveformType);

    if (container) {
      const currentActive = document.querySelector(".note-card.active");
      if (currentActive) {
        currentActive.classList.remove("active");
      }
      card.classList.add("active");

      container.append(card);
    }
  });
};
