import { useState, useRef } from "react";
import api from "../services/api";

function Upload() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("content", content);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post("/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);

      setTitle("");
      setSubject("");
      setDescription("");
      setContent("");
      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
            <h3>Please wait...</h3>
            <p>Uploading your notes. Do not close this page.</p>
          </div>
        </div>
      )}

      <div className="page">
        <div className="hero">
          <h1>📤 Upload Notes</h1>
          <p>Upload files or paste text notes for other students.</p>
        </div>

        <div className="upload-card">
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
              rows="3"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <textarea
              rows="8"
              placeholder="Paste your text notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />

            <button type="submit" className="upload-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload Note"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Upload;
