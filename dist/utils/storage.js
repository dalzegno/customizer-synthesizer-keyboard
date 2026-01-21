const STORAGE_KEY = "myNoteList";
export const saveNotes = (notes) => {
    const jsonString = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEY, jsonString);
};
export const loadNotes = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
        return [];
    }
    const parsedData = JSON.parse(storedData);
    return parsedData;
};
/* const saveToLocalStorage = () => {
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
}; */
