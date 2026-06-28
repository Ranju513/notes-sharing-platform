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
  const [openFiles, setOpenFiles] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

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
      const token = localStorage.getItem("token");

      const res = await api.delete(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      getNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const getFiles = (note) => {
    if (note.files && note.files.length > 0) return note.files;

    if (note.filePath) {
      return [
        {
          fileName: note.fileName || "File 1",
          filePath: note.filePath,
        },
      ];
    }

    return [];
  };

  const canDelete = (note) => {
    if (!currentUser || !note.uploadedBy) return false;

    if (typeof note.uploadedBy === "string") {
      return currentUser.id === note.uploadedBy;
    }

    return currentUser.id === note.uploadedBy._id;
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>
          <FaBook /> Notes Sharing Platform
        </h1>
        <p>Share files and text notes easily.</p>
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
          filteredNotes.map((note) => {
            const files = getFiles(note);

            return (
              <div className="note-card" key={note._id}>
                <div className="note-icon">
                  <FaFileAlt />
                </div>

                <div className="note-content">
                  <h2>{note.title}</h2>

                  <span className="subject-badge">{note.subject}</span>

                  <p className="note-description">
                    <b>Description:</b> {note.description}
                  </p>

                  {note.content && (
                    <div className="text-note">
                      <b>Text Notes:</b>
                      <p>{note.content}</p>
                    </div>
                  )}

                  <p className="note-date">
                    <FaCalendarAlt />{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>

                  <div className="note-actions">
                    {files.length === 0 && <small>No file uploaded</small>}

                    {files.length === 1 && (
                      <a
                        href={`https://notes-sharing-platform-lofj.onrender.com/${files[0].filePath}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaEye /> File 1
                      </a>
                    )}

                    {files.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFiles(openFiles === note._id ? null : note._id)
                        }
                      >
                        View Files ({files.length})
                      </button>
                    )}

                    {canDelete(note) && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteNote(note._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>

                  {openFiles === note._id && files.length > 1 && (
                    <div className="file-list">
                      {files.map((file, index) => (
                        <a
                          key={index}
                          href={`https://notes-sharing-platform-lofj.onrender.com/${file.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          File {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;
