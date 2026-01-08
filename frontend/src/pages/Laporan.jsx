import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Laporan() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "Guest" });

    const [filter, setFilter] = useState({
        startDate: "",
        endDate: "",
        type: "masuk" // 'masuk' or 'keluar'
    });

    const [data, setData] = useState([]);

    useEffect(() => {
        // Check login
        fetch("http://localhost:5000/api/me", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : Promise.reject("Belum login")))
            .then((data) => setUser(data))
            .catch(() => setUser({ username: "Guest" }));
    }, []);

    const handleLogout = () => {
        fetch("http://localhost:5000/api/logout", {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                setUser({ username: "Guest" });
                navigate("/login");
            })
            .catch((err) => console.error(err));
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const loadData = () => {
        if (!filter.startDate || !filter.endDate) {
            alert("Silakan pilih tanggal awal dan akhir");
            return;
        }

        const params = new URLSearchParams({
            start_date: filter.startDate,
            end_date: filter.endDate,
            type: filter.type
        });

        fetch(`http://localhost:5000/api/reports/transactions?${params.toString()}`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Laporan Barang ${filter.type === 'masuk' ? 'Masuk' : 'Keluar'}`, 14, 15);
        doc.text(`Periode: ${filter.startDate} s/d ${filter.endDate}`, 14, 22);

        const tableColumn = ["No", "Tanggal", "Nama Barang", "Jumlah", "User ID"];
        const tableRows = [];

        data.forEach((item, index) => {
            const rowData = [
                index + 1,
                new Date(item.tanggal).toLocaleDateString(),
                item.barang ? item.barang.nama : 'Unknown',
                item.jumlah,
                item.user_id
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });
        doc.save(`Laporan_${filter.type}_${filter.startDate}_${filter.endDate}.pdf`);
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map((item, index) => ({
            No: index + 1,
            Tanggal: new Date(item.tanggal).toLocaleDateString(),
            "Nama Barang": item.barang ? item.barang.nama : 'Unknown',
            Jumlah: item.jumlah,
            User: item.user_id
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
        XLSX.writeFile(workbook, `Laporan_${filter.type}_${filter.startDate}_${filter.endDate}.xlsx`);
    };

    return (
        <div className="d-flex bg-light min-vh-100">
            <Sidebar user={user} onLogout={handleLogout} />

            <div className="flex-grow-1 p-4">
                <div className="container shadow bg-white p-4 rounded">
                    <h2 className="fw-bold text-primary mb-4">Laporan & Ekspor</h2>

                    {/* Filters */}
                    <div className="row g-3 align-items-end mb-4 bg-light p-3 rounded">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tanggal Awal</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={filter.startDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Tanggal Akhir</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={filter.endDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Jenis Laporan</label>
                            <select
                                className="form-select"
                                name="type"
                                value={filter.type}
                                onChange={handleFilterChange}
                            >
                                <option value="masuk">Barang Masuk</option>
                                <option value="keluar">Barang Keluar</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100" onClick={loadData}>
                                <i className="bi bi-search me-2"></i>Tampilkan
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    {data.length > 0 && (
                        <div className="d-flex gap-2 mb-3">
                            <button className="btn btn-danger" onClick={exportPDF}>
                                <i className="bi bi-file-earmark-pdf me-2"></i>Export PDF
                            </button>
                            <button className="btn btn-success" onClick={exportExcel}>
                                <i className="bi bi-file-earmark-excel me-2"></i>Export Excel
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Tanggal</th>
                                    <th>Barang</th>
                                    <th>Jumlah</th>
                                    <th>Diproses Oleh (ID)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            Silakan pilih filter dan klik Tampilkan.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td>{item.barang ? item.barang.nama : 'Item dihapus'}</td>
                                            <td>{item.jumlah}</td>
                                            <td>{item.user_id}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
