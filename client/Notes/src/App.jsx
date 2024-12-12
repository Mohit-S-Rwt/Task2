import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const addNote = async () => {
    if (newNote.trim()) {
      try {
        const { data } = await axios.post(`${API_URL}/notes`, {
          content: newNote,
        });
        setNotes([data, ...notes]);
        setNewNote("");
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notes`);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <h1 >Notes</h1>
      <div className="note-input  ">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Take a note"
        />

        <button onClick={addNote}> Add</button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <div className="note" key={note.id}>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}> Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
