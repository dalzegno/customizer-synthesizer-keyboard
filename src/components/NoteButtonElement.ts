export const NoteButtonElement = (
  id: number,
  frequency: number,
  name: string,
  waveformType: string,
): HTMLElement => {
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

  const playArea = document.createElement("div");
  playArea.classList.add("note-play-area");
  playArea.style.backgroundColor = "green";
  playArea.append(titleElement, frequencyElement, waveformElement);

  const sustainCheckboxElement = document.createElement("input");
  sustainCheckboxElement.type = "checkbox";
  sustainCheckboxElement.classList.add("sustainInput");
  const sustainCheckboxLabel = document.createElement("label");
  sustainCheckboxLabel.textContent = "hold to sustain: ";
  sustainCheckboxLabel.setAttribute("for", "sustainInput");
  const sustainContainer = document.createElement("div");
  sustainContainer.append(sustainCheckboxLabel, sustainCheckboxElement);

  const removeElement = document.createElement("button");
  removeElement.textContent = "remove";
  removeElement.classList.add("btn-remove-note");

  card.append(playArea, sustainContainer, removeElement);

  return card as HTMLElement;
};
