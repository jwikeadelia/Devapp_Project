import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function TambahTransaksi({ handleSave  }) {
  const [showModal, setShowModal] = useState(false);
  
  const [id_barang, setIDBarang] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
  e.preventDefault();

  fetch("http://localhost:5000/api/barangkeluars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id_barang, tanggal, jumlah }),
  })
    .then(async (res) => {
      const data = await res.json();

      // Jika stok tidak cukup atau error lain dari server
      if (!res.ok) {
        alert(data.error || "Gagal menyimpan data");
        throw new Error(data.error || "Gagal menyimpan data");
      }

      // // Jika berhasil
      // alert(data.message || "Barang keluar berhasil ditambahkan");

      // Reset form dan tutup modal
      setIDBarang("");
      setTanggal("");
      setJumlah("");
      setShowModal(false);

      // Refresh data di Transaksi.jsx jika ada
      if (handleSave) handleSave();
    })
    .catch((err) => console.error(err));
};

  
  return (
    <div className="container mt-4">
      {/* Tombol untuk buka modal */}
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Tambah Barang Keluar
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
                      type="number"
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
                        navigate("/transaksi");
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
