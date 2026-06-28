import { useState } from "react";
import api from "../services/api";

function Upload() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await api.post("/notes/upload", formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Notes</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <br /><br />

        <input placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <br /><br />

        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <br /><br />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br /><br />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
