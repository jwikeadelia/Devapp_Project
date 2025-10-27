
# 📦 DEVAPP_PROJECT

## 🛠️ Tech Stack

- **Frontend**: React (JSX)
- **Backend**: Node.js + Express
- **Database**: MySQL (via Sequelize ORM)
- **Containerization**: Docker

---

## ✨ Fitur Utama

- Autentikasi pengguna (Login & Register)
- Manajemen stok barang (Tambah, Edit, Hapus)
- Transaksi penjualan barang

---

## 🚀 Cara Menjalankan

### 1. Backend

```bash
docker build -t keelay88/devapp_project:backend .
docker run -p 3001:3000 keelay88/devapp_project:backend
```

> Pastikan MySQL aktif di host dan database `crud_task` sudah tersedia.

### 2. Frontend

Masuk ke folder `frontend/` dan jalankan:

```bash
docker build -t keelay88/devapp_project:frontend .
docker run -p 3000:80 keelay88/devapp_project:frontend
```

> Pastikan `npm run build` sudah dikonfigurasi di `frontend/package.json`.

---

## 📈 Rencana Pengembangan

- Penambahan fitur laporan PDF
