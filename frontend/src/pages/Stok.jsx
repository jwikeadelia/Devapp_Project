import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TambahStok from "./TambahStok";
import EditStok from "./EditStok";
// ...import React, { useEffect, useState } from "react";
// ...import { Link } from "react-router-dom";

export default function Stok() {
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
        window.location.href = "/login";
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
      <div
        className="bg-primary text-white p-3 d-flex flex-column"
        style={{ width: "250px" }}
      >
        <h4 className="fw-bold text-center mb-4">
          <i className="bi bi-list-task me-2"></i>Menu
        </h4>
        <ul className="nav flex-column gap-2">
          <li>
            <Link to="/" className="nav-link text-white">
              <i className="bi bi-house-door me-2"></i>Home
            </Link>
          </li>
          <li>
            <Link to="/barang" className="nav-link text-white">
              <i className="bi bi-box-seam me-2"></i>Barang Masuk
            </Link>
          </li>
          <li>
            <Link to="/transaksi" className="nav-link text-white">
              <i className="bi bi-card-checklist me-2"></i>Barang Keluar
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link text-white">
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </Link>
          </li>
          <li>
            <Link
              to="/"
              onClick={handleLogout}
              className="nav-link text-white"
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Link>
          </li>
        </ul>

        <div className="mt-auto border-top pt-3 text-center">
          <i className="bi bi-person-circle fs-4"></i>
          <div className="fw-bold mt-1">{user.username}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="container shadow-lg rounded bg-white p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h2 className="fw-bold text-primary mb-0 text-uppercase letter-spacing-1">
                Kelola Stok
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
