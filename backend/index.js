import express from "express";
import Barang from "./models/Barang.js";
import BarangMasuk from "./models/BarangMasuk.js";
import BarangKeluar from "./models/BarangKeluar.js";
import user from "./models/users.js";
import session from "express-session";
import { sequelize } from "./database/database.js";
import bcrypt from "bcrypt";
import cors from "cors";
import { Op } from "sequelize";

const app = express();

// ====================== MIDDLEWARE ======================

// Support JSON & URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // alamat frontend
    credentials: true, // supaya cookie bisa dikirim
  })
);

// Session
app.use(
  session({
    secret: "iasdsad212312dsf123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 jam
  })
);

// Middleware cek login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized, silakan login dulu" });
  }
  next();
}

// ====================== AUTH ======================

// Register
app.post("/api/regis", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await user.create({ username, password: hash });
    res.json({ message: "Registrasi berhasil", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Registrasi gagal", error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const found = await user.findOne({ where: { username } });

    if (!found)
      return res.status(400).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, found.password);
    if (!match) return res.status(400).json({ message: "Password salah" });

    req.session.user = { id: found.id, username: found.username };
    res.json({ message: "Login berhasil", user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: "Login gagal", error: err.message });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout gagal" });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logout berhasil" });
  });
});

// Get current user
app.get("/api/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Belum login" });
  }
});

// ====================== BARANG ======================

// Ambil semua barang
app.get("/api/barangs", requireLogin, async (req, res) => {
  try {
    const data = await Barang.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah barang
app.post("/api/barangs", requireLogin, async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;
    const barang = await Barang.create({ nama, harga, stok });
    res.json({ message: "Barang berhasil ditambahkan", barang });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit barang
app.put("/api/barangs/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;

    await Barang.update({ nama, harga, stok }, { where: { id } });
    res.json({ message: "Barang berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus barang
app.delete("/api/barangs/:id", requireLogin, async (req, res) => {
  try {
    await Barang.destroy({ where: { id: req.params.id } });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cari barang berdasarkan query
app.get("/api/barangs/search", requireLogin, async (req, res) => {
  try {
    const { q } = req.query; // query string ?q=keyword
    const data = await Barang.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${q}%` } },
          { nama: { [Op.like]: `%${q}%` } },
        ],
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== BARANG MASUK ======================

// Ambil semua barang masuk
app.get("/api/barangmasuks", requireLogin, async (req, res) => {
  try {
    const data = await BarangMasuk.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah barang masuk
app.post("/api/barangmasuks", requireLogin, async (req, res) => {
  try {
    const { id_barang, jumlah, tanggal } = req.body;
    const jumlahNumber = Number(jumlah);

    const barang = await Barang.findByPk(id_barang);
    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    barang.stok += jumlahNumber;
    await barang.save();

    const barangMasukBaru = await BarangMasuk.create({
      id_barang,
      jumlah,
      tanggal,
    });

    res.json({
      message: "Barang masuk berhasil ditambahkan dan stok diperbarui",
      data: {
        barang: barang,
        barangMasuk: barangMasukBaru,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit barang masuk
app.put("/api/barangmasuks/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { id_barang, jumlah, tanggal } = req.body;
    const jumlahNumber = Number(jumlah);

    const barangMasuk = await BarangMasuk.findByPk(id);
    if (!barangMasuk) {
      return res.status(404).json({ message: "Data barang masuk tidak ditemukan" });
    }

    // Ambil barang terkait
    const barang = await Barang.findByPk(id_barang);
    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Hitung selisih antara jumlah lama dan jumlah baru
    const selisih = jumlahNumber - barangMasuk.jumlah;

    // Update stok berdasarkan selisih
    barang.stok += selisih;
    await barang.save();

    // Update data barang masuk
    barangMasuk.id_barang = id_barang;
    barangMasuk.jumlah = jumlahNumber;
    barangMasuk.tanggal = tanggal;
    await barangMasuk.save();

    res.json({
      message: "Data barang masuk dan stok berhasil diperbarui",
      data: {
        barang: barang,
        barangMasuk: barangMasuk,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus barang masuk
app.delete("/api/barangmasuks/:id", requireLogin, async (req, res) => {
  try {
    await BarangMasuk.destroy({ where: { id: req.params.id } });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cari barang masuk berdasarkan query
app.get("/api/barangmasuks/search", requireLogin, async (req, res) => {
  try {
    const { q } = req.query; // query string ?q=keyword
    const data = await BarangMasuk.findAll({
      where: {
        [Op.or]: [
          { id_barang: { [Op.like]: `%${q}%` } },
        ],
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== BARANG KELUAR ======================

// Ambil semua barang keluar
app.get("/api/barangkeluars", requireLogin, async (req, res) => {
  try {
    const data = await BarangKeluar.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah barang keluar
app.post("/api/barangkeluars", requireLogin, async (req, res) => {
  try {
    const { id_barang, jumlah, tanggal } = req.body;
    const jumlahNumber = Number(jumlah);

    const barang = await Barang.findByPk(id_barang);
    if (!barang) {
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    }

    // Cek stok cukup
    if (barang.stok < jumlahNumber) {
      return res
        .status(400)
        .json({ error: "Stok barang tidak mencukupi untuk transaksi ini" });
    }

    // Kurangi stok
    barang.stok -= jumlahNumber;
    await barang.save();

    // Tambah data barang keluar
    const barangKeluarBaru = await BarangKeluar.create({
      id_barang,
      jumlah: jumlahNumber,
      tanggal,
    });

    res.json({
      message: "Barang keluar berhasil ditambahkan dan stok diperbarui",
      data: {
        barang: barang,
        barangKeluar: barangKeluarBaru,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit barang keluar
app.put("/api/barangkeluars/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { id_barang, jumlah, tanggal } = req.body;
    const jumlahNumber = Number(jumlah);

    const barangKeluar = await BarangKeluar.findByPk(id);
    if (!barangKeluar) {
      return res.status(404).json({ message: "Data barang keluar tidak ditemukan" });
    }

    // Ambil barang terkait
    const barang = await Barang.findByPk(id_barang);
    if (!barang) {
      return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    const selisih = jumlahNumber - barangKeluar.jumlah;
    barang.stok -= selisih; // kebalikan dari barang masuk

    // Pastikan stok tidak negatif
    if (barang.stok < 0) {
      return res.status(400).json({ message: "Stok barang tidak mencukupi untuk perubahan ini" });
    }

    await barang.save();

    // Update data barang keluar
    barangKeluar.id_barang = id_barang;
    barangKeluar.jumlah = jumlahNumber;
    barangKeluar.tanggal = tanggal;
    await barangKeluar.save();

    res.json({
      message: "Data barang keluar dan stok berhasil diperbarui",
      data: {
        barang: barang,
        barangKeluar: barangKeluar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus barang keluar
app.delete("/api/barangkeluars/:id", requireLogin, async (req, res) => {
  try {
    await BarangKeluar.destroy({ where: { id: req.params.id } });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cari barang keluar berdasarkan query
app.get("/api/barangkeluars/search", requireLogin, async (req, res) => {
  try {
    const { q } = req.query; // query string ?q=keyword
    const data = await BarangKeluar.findAll({
      where: {
        [Op.or]: [
          { id_barang: { [Op.like]: `%${q}%` } },
        ],
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== RUN SERVER ======================
sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
});
