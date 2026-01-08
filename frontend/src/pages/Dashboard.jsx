import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBarang: 0,
        lowStock: 0,
        totalMasuk: 0,
        totalKeluar: 0,
    });
    const [user, setUser] = useState({ username: "Guest" });

    useEffect(() => {
        // Check login & fetch user
        fetch("http://localhost:5000/api/me", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : Promise.reject("Belum login")))
            .then((data) => setUser(data))
            .catch(() => setUser({ username: "Guest" }));

        // Fetch stats
        fetch("http://localhost:5000/api/dashboard", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : Promise.reject("Gagal load stats")))
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
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

    // Chart Data
    const transactionData = {
        labels: ["Barang Masuk", "Barang Keluar"],
        datasets: [
            {
                label: "Total Transaksi",
                data: [stats.totalMasuk, stats.totalKeluar],
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    return (
        <div className="d-flex bg-light min-vh-100">
            <Sidebar user={user} onLogout={handleLogout} />

            <div className="flex-grow-1 p-4">
                <div className="container" style={{ maxWidth: "1000px" }}>
                    <h2 className="fw-bold text-primary mb-4">Dashboard & Analitik</h2>

                    <div className="row g-4 mb-5">
                        {/* Total Barang */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body text-center">
                                    <h6 className="text-muted">Total Barang</h6>
                                    <h2 className="fw-bold">{stats.totalBarang}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 h-100 border-start border-5 border-danger">
                                <div className="card-body text-center">
                                    <h6 className="text-danger">Stok Menipis (&lt;5)</h6>
                                    <h2 className="fw-bold text-danger">{stats.lowStock}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Barang Masuk */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body text-center">
                                    <h6 className="text-muted">Total Transaksi Masuk</h6>
                                    <h2 className="fw-bold text-info">{stats.totalMasuk}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Barang Keluar */}
                        <div className="col-md-3">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body text-center">
                                    <h6 className="text-muted">Total Transaksi Keluar</h6>
                                    <h2 className="fw-bold text-warning">{stats.totalKeluar}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card shadow-sm border-0 p-3">
                                <h5 className="card-title fw-bold mb-3">Perbandingan Transaksi</h5>
                                <Bar
                                    data={transactionData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            {/* Maybe put Low Stock list here if we had the data? For now standard alert */}
                            <div className="card shadow-sm border-0 p-3 h-100">
                                <h5 className="card-title fw-bold mb-3">Quick Actions</h5>
                                <div className="d-grid gap-2">
                                    <Link to="/tambah" className="btn btn-outline-primary">
                                        <i className="bi bi-plus-lg me-2"></i>Tambah Barang
                                    </Link>
                                    <Link to="/stok" className="btn btn-outline-info">
                                        <i className="bi bi-box-arrow-in-down me-2"></i>Catat Barang Masuk
                                    </Link>
                                    <Link to="/transaksi" className="btn btn-outline-warning">
                                        <i className="bi bi-box-arrow-up me-2"></i>Catat Barang Keluar
                                    </Link>
                                    <Link to="/laporan" className="btn btn-outline-success">
                                        <i className="bi bi-file-earmark-text me-2"></i>Lihat Laporan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
