import React, { useState } from "react";

export default function EditTransaksi({ transaksi, handleUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [id_barang, setIDBarang] = useState(transaksi?.id_barang || "");
  const [tanggal, setTanggal] = useState(transaksi?.tanggal || "");
  const [jumlah, setJumlah] = useState(transaksi?.jumlah || "");

  const openModal = () => {
    setIDBarang(transaksi.id_barang);
    setTanggal(transaksi.tanggal);
    setJumlah(transaksi.jumlah);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/barangkeluars/${transaksi.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id_barang, tanggal, jumlah }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal update data");
        return res.json();
      })
      .then(() => {
        handleUpdate(); // refresh data di parent
        setShowModal(false); // tutup modal
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <button className="btn btn-warning btn-sm" onClick={openModal} title="Ubah">
        <i className="bi bi-pencil-square"></i>
      </button>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">Edit Transaksi</h5>
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
                      type="text"
                      className="form-control"
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
                      value={jumlah}
                      onChange={(e) => setJumlah(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn btn-warning text-white">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
