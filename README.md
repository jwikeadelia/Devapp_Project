# Inventory Management System (Devapp Project)

## 📋 Deskripsi Singkat
Aplikasi **Inventory Management System** ini dirancang untuk mempermudah pengelolaan stok barang. Sistem ini terdiri dari backend berbasis Node.js dan frontend modern (React), yang mendukung fitur autentikasi pengguna, manajemen data barang (CRUD), pencatatan barang masuk/keluar, serta dashboard monitoring stok.

## 🚀 Fitur Utama
- **Autentikasi**: Login dan Register pengguna yang aman.
- **Manajemen Barang**: Tambah, edit, hapus, dan cari data barang.
- **Transaksi**: Pencatatan barang masuk dan barang keluar yang otomatis mengupdate stok.
- **Dashboard**: Statistik ringkas mengenai total barang, stok menipis, dan riwayat transaksi.
- **Monitoring**: Integrasi dengan Prometheus dan Grafana untuk memantau kesehatan aplikasi di Kubernetes.

## 🛠️ Teknologi yang Digunakan
- **Backend**: Node.js, Express, MySQL, Sequelize
- **Frontend**: React (Vite), Tailwind CSS
- **Infrastructure**: Docker/Podman, Kubernetes (Minikube)
- **Monitoring**: Prometheus, Grafana

---

## 💻 Cara Penggunaan

### Opsi 1: Menjalankan dengan Podman Compose (Lokal)
Cara termudah untuk menjalankan aplikasi secara lokal.

1.  **Build dan Jalankan Container:**
    ```powershell
    podman-compose up -d --build
    ```

2.  **Akses Aplikasi:**
    - **Frontend:** [http://localhost:8080](http://localhost:8080)
    - **Backend API:** [http://localhost:5000](http://localhost:5000)

3.  **Hentikan Aplikasi:**
    ```powershell
    podman-compose down
    ```

---

### Persiapan Lingkungan Kubernetes (Minikube)
Sebelum melakukan deployment, pastikan lingkungan Minikube sudah siap.

1.  **Instalasi Minikube:**
    Download dan install Minikube sesuai sistem operasi Anda dari [Dokumentasi Resmi Minikube](https://minikube.sigs.k8s.io/docs/start/).

2.  **Menjalankan Minikube:**
    Jika menggunakan Podman, disarankan untuk mengunduh base image terlebih dahulu:
    ```powershell
    podman pull gcr.io/k8s-minikube/kicbase:v0.0.48
    ```

    Kemudian jalankan cluster:
    ```powershell
    minikube start --driver=podman
    ```
    *Catatan: Driver bisa disesuaikan, misalnya `docker` atau `podman`.*

3.  **Mengaktifkan Metrics Server:**
    Agar fitur autoscaling (HPA) dan monitoring berfungsi:
    ```powershell
    minikube addons enable metrics-server
    ```

4.  **Menghubungkan Podman ke Minikube:**
    Agar Minikube bisa menggunakan image yang Anda build secara lokal:
    ```powershell
    # Build langsung di dalam Minikube (Direkomendasikan)
    minikube image build -t localhost/devapp_project_backend:latest ./backend
    minikube image build -t localhost/devapp_project_frontend:latest ./frontend
    ```

### Opsi 2: Deployment ke Kubernetes (Minikube)
Untuk simulasi production environment menggunakan Kubernetes.

1.  **Apply Manifests:**
    ```powershell
    kubectl apply -f k8s/
    kubectl apply -f k8s/monitoring/
    ```

2.  **Akses Aplikasi (Port Forwarding):**
    Buka dua terminal terpisah:
    - **Terminal 1 (Backend):** `kubectl port-forward svc/backend-service 5000:5000 -n devapp`
    - **Terminal 2 (Frontend):** `kubectl port-forward svc/frontend-service 8080:80 -n devapp`

    Akses Frontend di [http://localhost:8080](http://localhost:8080).

3.  **Akses Monitoring (Grafana):**
    ```powershell
    kubectl port-forward svc/grafana 3000:3000 -n monitoring
    ```
    Akses Grafana di [http://localhost:3000](http://localhost:3000) (Default login: admin/admin).

### Verifikasi & Troubleshooting
Jika ada kendala, gunakan perintah berikut untuk debugging:

1.  **Cek Status Pods:**
    ```powershell
    kubectl get pods -n devapp
    ```

2.  **Cek Detail Lengkap:**
    ```powershell
    kubectl get svc,pods,deploy -o wide -n devapp
    ```

3.  **Cek URL Service (Tanpa Port-Forward):**
    ```powershell
    minikube service backend-service --url -n devapp
    minikube service frontend-service --url -n devapp
    ```

---

## 🏗️ Arsitektur Sistem
Aplikasi ini menggunakan arsitektur **Monolithic** yang dikemas dalam container (Dockerized) dan di-deploy menggunakan orkestrasi Kubernetes.

1.  **Frontend**: Single Page Application (SPA) berbasis React yang berkomunikasi dengan Backend melalui REST API.
2.  **Backend**: RESTful API server berbasis Express.js yang menangani logika bisnis dan autentikasi.
3.  **Database**: MySQL sebagai tempat penyimpanan data relasional (User, Barang, Transaksi).
4.  **Monitoring**:
    - **Prometheus**: Mengumpulkan metrik performa dari k8s dan aplikasi.
    - **Grafana**: Visualisasi dashboard untuk memantau status server dan resource.

---

## 📦 Daftar Dependensi & Tools

### Backend (`/backend`)
- **Core**: `express` (Web Framework), `sequelize` (ORM), `mysql2` (DB Driver)
- **Auth**: `bcrypt` (Hashing Password), `express-session` (Session Management)
- **Utils**: `cors` (Cross-Origin Resource Sharing), `dotenv` (Environment Variables)
- **Dev**: `nodemon` (Auto-reload development server)

### Frontend (`/frontend`)
- **Core**: `react`, `react-dom`, `react-router-dom` (Routing)
- **UI/Styling**: `bootstrap`, `react-bootstrap`, `tailwindcss`
- **Data & Charts**: `chart.js`, `react-chartjs-2` (Visualisasi Data), `xlsx` (Export Excel)
- **Export**: `jspdf`, `jspdf-autotable` (Cetak Laporan PDF)
- **Build Tool**: `vite`

---

### Opsi 3: Export Image (Untuk Pengumpulan Tugas/Backup)
Jika Anda perlu mengumpulkan file image atau memindahkan ke komputer lain tanpa internet.

```powershell
# Export Backend
podman save -o backend.tar localhost/devapp_project_backend:latest

# Export Frontend
podman save -o frontend.tar localhost/devapp_project_frontend:latest

# Export MySQL (Opsional)
podman save -o mysql.tar docker.io/library/mysql:8.0
```

---
*Dibuat untuk UAS DevOps Semester 7.*
