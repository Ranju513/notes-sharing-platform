import { useEffect, useState } from "react";
import { FaBook, FaSearch, FaTrash, FaFileAlt } from "react-icons/fa";
import api from "../services/api";

function Home() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const getNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      alert("Failed to load notes");
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await api.delete(`/notes/${id}`);
      alert(res.data.message);
      getNotes();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="hero">
        <h1><FaBook /> Notes Sharing Platform</h1>
        <p>Share, search and download study notes easily.</p>
      </div>

      <div className="search-area">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by title or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>Total Notes: {filteredNotes.length}</h2>

      {filteredNotes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        filteredNotes.map((note) => (
          <div className="card" key={note._id}>
            <h2><FaFileAlt /> {note.title}</h2>

            <p><b>Subject:</b> {note.subject}</p>
            <p><b>Description:</b> {note.description}</p>

            <a
              href={`http://localhost:5001/${note.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="file-link"
            >
              View File
            </a>

            <button
              className="delete-btn"
              onClick={() => deleteNote(note._id)}
            >
              <FaTrash /> Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
