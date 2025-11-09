import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Edit() {
  const { id } = useParams();
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/barangs/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setKode(data.kode);
        setNama(data.nama);
        setHarga(data.harga);
        setStok(data.stok);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/barangs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nama, harga, stok }),
    })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ maxWidth: 500, width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center fw-bold text-uppercase mb-4 text-primary letter-spacing-1">
            Ubah Detail Barang
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Nama Barang
              </label>
              <input
                className="form-control rounded-pill px-4"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama"
                autoFocus
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Harga Barang
              </label>
              <input
                type="number"
                className="form-control rounded-pill px-4"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Masukkan nama tugas"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Stok
              </label>
              <input
                type="number"
                className="form-control rounded-pill px-4"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Masukkan nama tugas"
                required
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <Link
                to="/"
                className="btn btn-outline-secondary rounded-pill px-4"
              >
                Kembali
              </Link>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 shadow-sm"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
