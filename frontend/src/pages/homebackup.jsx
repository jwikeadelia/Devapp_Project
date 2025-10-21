import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// ...import React, { useEffect, useState } from "react";
// ...import { Link } from "react-router-dom";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ username: "Guest" });
  const [query, setQuery] = useState(""); // untuk search
  const [detailTask, setDetailTask] = useState(null); // untuk detail

  // Ambil user
  useEffect(() => {
    fetch("http://localhost:5000/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject("Belum login")))
      .then((data) => setUser(data))
      .catch(() => setUser({ username: "Guest" }));
  }, []);

  // Ambil semua task
  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject("Gagal ambil task")))
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };
  useEffect(fetchTasks, []);

  // Hapus
  const hapus = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => fetchTasks())
      .catch((err) => console.error(err));
  };

  // Tandai selesai
  const tandaiSelesai = (id) => {
    fetch(`http://localhost:5000/api/selesai/${id}`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => fetchTasks())
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
      fetchTasks();
      return;
    }

    // jika ada query → cari
    fetch(`http://localhost:5000/api/tasks/search?q=${value}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  };

  // Lihat detail
  const lihatDetail = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}/detail`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDetailTask(data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container shadow-lg rounded bg-white p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h2 className="fw-bold text-primary mb-0 text-uppercase letter-spacing-1">
              <i className="bi bi-list-task me-2"></i>Daftar Tugas
            </h2>
            <span className="text-muted fs-6">
              Kelola tugas harian Anda dengan mudah
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-secondary fs-6 px-3 py-2">
              <i className="bi bi-person-circle me-1"></i>
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>

        {/* Search & Add */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Cari tugas..."
              value={query}
              onChange={handleSearchInput}
              style={{ borderRight: 0 }} // onInput search
            />
            <span className="input-group-text bg-transparent text-black">
              <i className="bi bi-search"></i>
            </span>
          </div>

          <div className="d-flex gap-2">
            <Link to="/tambah" className="btn btn-primary shadow-sm">
              <i className="bi bi-plus-circle me-1"></i>Tambah Tugas
            </Link>
            <Link to="/selesai" className="btn btn-success shadow-sm">
              <i className="bi bi-check2-all me-1"></i>Tugas Selesai
            </Link>
          </div>
        </div>
        {/* Tabel */}
        <div className="table-responsive rounded shadow-sm">
          <table className="table align-middle table-hover table-bordered mb-0">
            <thead className="table-primary">
              <tr>
                <th style={{ width: "5%" }}>No</th>
                <th style={{ width: "20%" }}>Nama</th>
                <th style={{ width: "30%" }}>Tugas</th>
                <th style={{ width: "20%" }}>Waktu</th>
                <th style={{ width: "25%" }}>Menu</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    <i className="bi bi-emoji-frown fs-3"></i>
                    <div className="mt-2">Belum ada tugas.</div>
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="fw-bold">{index + 1}</td>
                    <td>{task.nama}</td>
                    <td>{task.namaTugas}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {task.waktu}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => tandaiSelesai(task.id)}
                          title="Tandai Selesai"
                        >
                          <i className="bi bi-check2"></i>
                        </button>
                        <Link
                          to={`/edit/${task.id}`}
                          className="btn btn-warning btn-sm"
                          title="Ubah"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => lihatDetail(task.id)}
                          title="Lihat Detail"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => hapus(task.id)}
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

        {/* Modal Detail */}
        {detailTask && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h5>Detail Tugas</h5>
            <p>
              <strong>Nama:</strong> {detailTask.nama}
            </p>
            <p>
              <strong>Tugas:</strong> {detailTask.namaTugas}
            </p>
            <p>
              <strong>Waktu:</strong> {detailTask.waktu}
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setDetailTask(null)}
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      <style>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .table thead th { vertical-align: middle; }
      `}</style>
    </div>
  );
}
