import { Note } from "../models/Note.js";
import { loadNotes } from "../utils/storage.js";

const noteList: Note[] = [
  {
    id: 1,
    name: "A 432",
    frequency: 432,
    waveformType: "sine",
  },
];

export const getNoteList = (): Note[] => {
  return [...noteList];
};

export const getNoteListFromLocalStorage = (): Note[] => {
  let noteList = loadNotes();
  return noteList;
};
