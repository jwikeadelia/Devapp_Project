import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TambahStok from "./TambahStok";
import EditStok from "./EditStok";
// ...import React, { useEffect, useState } from "react";
// ...import { Link } from "react-router-dom";

export default function Stok() {
  const navigate = useNavigate();
  const [barangs, setBarangs] = useState([]);
  const [user, setUser] = useState({ username: "Guest" });
  const [query, setQuery] = useState(""); // untuk search

  // Ambil user
  useEffect(() => {
    fetch("http://localhost:5000/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject("Belum login")))
      .then((data) => setUser(data))
      .catch(() => setUser({ username: "Guest" }));
  }, []);

  // Ambil semua barang
  const fetchBarangs = () => {
    fetch("http://localhost:5000/api/barangmasuks", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject("Gagal ambil barang")))
      .then((data) => setBarangs(data))
      .catch((err) => console.error(err));
  };
  useEffect(fetchBarangs, []);

  // Hapus
  const hapus = (id) => {
    fetch(`http://localhost:5000/api/barangmasuks/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => fetchBarangs())
      .catch((err) => console.error(err));
  };

  // Logout
  const handleLogout = () => {
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser({ username: "Guest" });
        // setUser(null);
        navigate('/login');
        setUser(null);
        // window.location.href = "/login";
      })
      .catch((err) => console.error(err));
  };

  // Search onInput
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      // kosong → ambil semua
      fetchBarangs();
      return;
    }

    // jika ada query → cari
    fetch(`http://localhost:5000/api/barangmasuks/search?q=${value}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBarangs(data))
      .catch((err) => console.error(err));
  };

  // handleSave sementara
  const handleSave = () => {
    fetchBarangs(); // refresh data setelah simpan
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar */}
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="container shadow-lg rounded bg-white p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h2 className="fw-bold text-primary mb-0 text-uppercase letter-spacing-1">
                Kelola Stok Barang
              </h2>
            </div>
          </div>

          {/* Search & Add */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="input-group" style={{ width: "400px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Cari barang..."
                value={query}
                onChange={handleSearchInput}
                style={{ borderRight: 0 }}
              />
              <span className="input-group-text bg-transparent text-black">
                <i className="bi bi-search"></i>
              </span>
            </div>

            <div className="d-flex gap-2">
              <TambahStok
                handleSave={handleSave}
              />
            </div>
          </div>

          {/* Tabel */}
          <div className="table-responsive rounded shadow-sm">
            <table className="table align-middle table-hover table-bordered mb-0">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "5%" }}>No</th>
                  <th style={{ width: "20%" }}>ID Barang</th>
                  <th style={{ width: "20%" }}>Tanggal</th>
                  <th style={{ width: "30%" }}>Jumlah</th>
                  <th style={{ width: "15%" }}>User</th>
                  <th style={{ width: "25%" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barangs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      <i className="bi bi-emoji-frown fs-3"></i>
                      <div className="mt-2">Belum ada tugas.</div>
                    </td>
                  </tr>
                ) : (
                  barangs.map((barang, index) => (
                    <tr key={barang.id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{barang.id_barang}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {barang.tanggal}
                        </span>
                      </td>
                      <td>{barang.jumlah}</td>
                      <td>{barang.user_id}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <EditStok
                            stok={barang}
                            handleUpdate={fetchBarangs}
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => hapus(barang.id)}
                            title="Hapus"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .table thead th { vertical-align: middle; }
        .nav-link:hover { background-color: rgba(255, 255, 255, 0.2); border-radius: 5px; }
      `}</style>
    </div>
  );
}
