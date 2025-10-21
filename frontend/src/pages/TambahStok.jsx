import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function TambahStok({ handleSave  }) {
  const [showModal, setShowModal] = useState(false);
  const [id_barang, setIDBarang] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("");
  const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/barangmasuks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_barang, tanggal, jumlah }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal menyimpan data");
        return res.json();
      })
      .then(() => {
        setIDBarang("");
        setTanggal("");
        setJumlah("");
        setShowModal(false); // close modal
        if (handleSave) handleSave(); // refresh data di Transaksi.jsx
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      {/* Tombol untuk buka modal */}
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Tambah Barang Masuk
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tambah Barang Masuk</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">ID Barang</label>
                    <input
                      className="form-control"
                      placeholder="ID Barang"
                      value={id_barang}
                      onChange={(e) => setIDBarang(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Jumlah</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Jumlah"
                      value={jumlah}
                      onChange={(e) => setJumlah(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIDBarang("");
                        setTanggal("");
                        setJumlah("");
                        navigate("/stok");
                      }}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
