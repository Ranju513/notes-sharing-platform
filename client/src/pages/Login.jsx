import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message);
      navigate("/");
      window.location.reload();
    } catch (err) {
      const message = err.response?.data?.message || "Login Failed";

if (message.includes("Please verify your email")) {        alert(message);

        navigate("/verify-otp", {
          state: {
            email: form.email,
          },
        });

        return;
      }

      alert(message);
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <br />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
