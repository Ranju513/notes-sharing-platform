import { useState } from "react";
import api from "../services/api";

function Upload() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("content", content);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
const token = localStorage.getItem("token");

const res = await api.post("/notes/upload", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>📤 Upload Notes</h1>
        <p>Upload files or paste text notes for other students.</p>
      </div>

      <div className="upload-card">
        <form onSubmit={handleSubmit}>
          <input placeholder="Note Title" onChange={(e) => setTitle(e.target.value)} />

          <input placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />

          <textarea
            rows="3"
            placeholder="Short Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <textarea
            rows="8"
            placeholder="Paste your text notes here..."
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />

          <button type="submit" className="upload-btn">
            Upload Note
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
