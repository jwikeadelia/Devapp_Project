import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Login gagal");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat login");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: 400, width: "100%", textAlign: "center" }}
      >
        <div className="text-center d-flex flex-column justify-content-center align-items-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="login"
            width={64}
            className="mb-3"
          />
          <h3 className="fw-bold text-uppercase">Login</h3>
          <p className="text-muted mb-0">Masuk ke akun Anda</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Masukkan username"
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/regis" className="small text-decoration-none">
              Belum punya akun?
            </Link>
            <button type="submit" className="btn btn-primary px-4">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
