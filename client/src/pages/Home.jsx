import { useEffect, useState } from "react";
import {
  FaBook,
  FaSearch,
  FaTrash,
  FaFileAlt,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
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

      <div className="stats">
        <div className="stat-card">
          <h3>Total Notes</h3>
          <p>{notes.length}</p>
        </div>

        <div className="stat-card">
          <h3>Search Results</h3>
          <p>{filteredNotes.length}</p>
        </div>

        <div className="stat-card">
          <h3>Subjects</h3>
          <p>{new Set(notes.map((note) => note.subject)).size}</p>
        </div>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          filteredNotes.map((note) => (
            <div className="note-card" key={note._id}>
              <div className="note-icon">
                <FaFileAlt />
              </div>

              <div className="note-content">
                <h2>{note.title}</h2>

                <span className="subject-badge">
                  {note.subject}
                </span>

                <p className="note-description">
                  {note.description}
                </p>

                <p className="note-date">
                  <FaCalendarAlt />{" "}
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>

                <div className="note-actions">
                  <a
                    href={`http://localhost:5001/${note.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaEye /> View File
                  </a>

                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(note._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
