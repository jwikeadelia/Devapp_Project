import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();

    // If onLogout is not provided, use default behavior (conceptually)
    // But purely UI, we just call onLogout.

    return (
        <div
            className="bg-primary text-white p-3 d-flex flex-column"
            style={{ width: "250px", minHeight: "100vh" }}
        >
            <h4 className="fw-bold text-center mb-4">
                <i className="bi bi-list-task me-2"></i>Menu
            </h4>
            <ul className="nav flex-column gap-2">
                <li>
                    <Link to="/dashboard" className="nav-link text-white">
                        <i className="bi bi-speedometer2 me-2"></i>Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/" className="nav-link text-white">
                        <i className="bi bi-house-door me-2"></i>Barang
                    </Link>
                </li>
                <li>
                    <Link to="/stok" className="nav-link text-white">
                        <i className="bi bi-box-seam me-2"></i>Barang Masuk
                    </Link>
                </li>
                <li>
                    <Link to="/transaksi" className="nav-link text-white">
                        <i className="bi bi-card-checklist me-2"></i>Barang Keluar
                    </Link>
                </li>
                <li>
                    <Link to="/laporan" className="nav-link text-white">
                        <i className="bi bi-file-earmark-bar-graph me-2"></i>Laporan
                    </Link>
                </li>
                <li>
                    <Link to="/login" className="nav-link text-white">
                        <i className="bi bi-box-arrow-in-right me-2"></i>Login
                    </Link>
                </li>
                <li>
                    <button
                        onClick={onLogout}
                        className="nav-link text-white bg-transparent border-0 text-start w-100"
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                </li>
            </ul>

            <div className="mt-auto border-top pt-3 text-center">
                <i className="bi bi-person-circle fs-4"></i>
                <div className="fw-bold mt-1">{user?.username || "Guest"}</div>
            </div>
            <style>{`
        .nav-link:hover { background-color: rgba(255, 255, 255, 0.2); border-radius: 5px; }
      `}</style>
        </div>
    );
}
