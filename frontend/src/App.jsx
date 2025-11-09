import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tambah from "./pages/Tambah";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transaksi from "./pages/TransaksiPenjualan";
import Stok from "./pages/Stok";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tambah" element={<Tambah />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regis" element={<Register />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/stok" element={<Stok />} />
      </Routes>
    </Router>
  );
}
