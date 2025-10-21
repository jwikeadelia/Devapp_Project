import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Tambah() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/barangs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nama, harga, stok }),
    })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: 500, width: "100%", borderRadius: 20 }}
      >
        <h3
          className="text-center fw-bold text-uppercase mb-4"
          style={{ letterSpacing: 2, color: "#4f46e5" }}
        >
          Tambah Daftar Barang
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Nama Barang
            </label>
            <input
              className="form-control form-control-lg rounded-pill"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama barang"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Harga Barang
            </label>
            <input
              type="number"
              className="form-control form-control-lg rounded-pill"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Masukkan harga barang"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Stok
            </label>
            <input
              type="number"
              className="form-control form-control-lg rounded-pill"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Masukkan jumlah stok"
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link
              to="/"
              className="btn btn-outline-secondary rounded-pill px-4 py-2"
            >
              Kembali
            </Link>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 shadow-sm"
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                border: "none",
              }}
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
