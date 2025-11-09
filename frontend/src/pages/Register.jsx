import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [kPassword, setKPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (password !== kPassword) {
      setError("Password tidak sama!");
      return;
    }
    fetch("http://localhost:5000/api/regis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then(() => navigate("/login"))
      .catch((err) => setError("Registrasi gagal. Silakan coba lagi."));
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <div className="text-center d-flex flex-column justify-content-center align-items-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Register"
            width={64}
            className="mb-2"
          />
          <h3 className="fw-bold text-uppercase">Registrasi</h3>
          <p className="text-muted mb-0">Buat akun baru untuk melanjutkan</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="form-control"
              value={kPassword}
              onChange={(e) => setKPassword(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link to="/login" className="btn btn-outline-secondary">
              Login
            </Link>
            <button type="submit" className="btn btn-primary px-4">
              Registrasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
