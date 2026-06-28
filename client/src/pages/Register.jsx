import { useState } from "react";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="page">
      <h2>Create Account</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} />
          <br /><br />

          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <br /><br />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <br /><br />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
