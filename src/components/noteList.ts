import { Note } from "../models/Note.js";

export const renderNotes = (containerId: string, noteList: Note[]) => {
  const container = document.querySelector(`${containerId}`);
  if (!container) {
    return;
  }
  if (container) {
    container.replaceChildren();
  }

  noteList.forEach(({ id, name, frequency, waveformType, sustainChecked }) => {
    const card = document.createElement("article");
    card.classList.add("note-card");

    card.dataset.id = id.toString();

    const titleElement = document.createElement("h3");
    titleElement.textContent = name;

    const frequencyElement = document.createElement("span");
    frequencyElement.textContent = frequency.toString();
    card.dataset.frequency = frequency.toString();

    const waveformElement = document.createElement("p");
    waveformElement.textContent = waveformType;
    card.dataset.waveformType = waveformType;

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
