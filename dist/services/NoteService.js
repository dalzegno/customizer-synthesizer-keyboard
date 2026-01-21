import { loadNotes } from "../utils/storage.js";
const noteList = [
    {
        id: 1,
        name: "A 432",
        frequency: 432,
        waveformType: "sine",
    },
];
export const getNoteList = () => {
    return [...noteList];
};
export const getNoteListFromLocalStorage = () => {
    let noteList = loadNotes();
    return noteList;
};
