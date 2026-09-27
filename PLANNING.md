# Perencanaan Sistem Informasi Jadwal Kapal

Sistem Informasi Jadwal Keberangkatan dan Kedatangan Kapal ini akan dibangun menggunakan arsitektur **Client-Server** dengan pembagian sebagai berikut:
- **Frontend (Client):** React.js
- **Backend (Server):** Node.js dengan Express.js
- **Database:** MySQL

Dokumen ini berisi rancangan awal dari sistem tersebut.

---

## 1. Arsitektur Sistem

* **Frontend:** Akan menampilkan UI kepada pengguna (penumpang/publik) untuk melihat jadwal, dan UI untuk admin guna mengelola jadwal. Berkomunikasi dengan backend menggunakan REST API.
* **Backend:** Menangani logika bisnis, routing, autentikasi (untuk admin), dan koneksi ke database.
* **Database:** Menyimpan relasi data kapal, pelabuhan, dan jadwal.

---

## 2. Desain Database (MySQL)

Kita akan membutuhkan setidaknya 3 tabel utama:

### Tabel `kapal` (Ships)
Menyimpan informasi armada kapal.
* `id` (INT, Primary Key, Auto Increment)
* `nama_kapal` (VARCHAR)
* `jenis_kapal` (VARCHAR) - misal: Feri, Ro-Ro, Penumpang
* `kapasitas` (INT)

### Tabel `pelabuhan` (Ports)
Menyimpan informasi pelabuhan asal dan tujuan.
* `id` (INT, Primary Key, Auto Increment)
* `nama_pelabuhan` (VARCHAR)
* `kota` (VARCHAR)

### Tabel `jadwal` (Schedules)
Tabel transaksi yang menghubungkan kapal dan pelabuhan beserta waktunya.
* `id` (INT, Primary Key, Auto Increment)
* `kapal_id` (INT, Foreign Key ke `kapal.id`)
* `pelabuhan_asal_id` (INT, Foreign Key ke `pelabuhan.id`)
* `pelabuhan_tujuan_id` (INT, Foreign Key ke `pelabuhan.id`)
* `waktu_berangkat` (DATETIME)
* `waktu_tiba` (DATETIME)
* `status` (ENUM: 'Terjadwal', 'Berangkat', 'Tiba', 'Tertunda', 'Batal')

---

## 3. Desain API (Express.js)

Backend akan menyediakan RESTful API sebagai berikut:

**Kapal:**
* `GET /api/kapal` - Mengambil semua data kapal
* `POST /api/kapal` - Menambah data kapal (Admin)

**Pelabuhan:**
* `GET /api/pelabuhan` - Mengambil semua data pelabuhan

**Jadwal:**
* `GET /api/jadwal` - Mengambil semua jadwal (mendukung query filter seperti `?asal=Merak&tujuan=Bakauheni&tanggal=2023-10-12`)
* `GET /api/jadwal/:id` - Mengambil detail satu jadwal
* `POST /api/jadwal` - Menambah jadwal baru (Admin)
* `PUT /api/jadwal/:id` - Mengupdate status jadwal/waktu (Admin)
* `DELETE /api/jadwal/:id` - Menghapus jadwal (Admin)

---

## 4. Desain Antarmuka (React.js Frontend)

**A. Halaman Publik (User)**
* **Beranda (Home):** Form pencarian jadwal (Pilih Pelabuhan Asal, Tujuan, dan Tanggal).
* **Hasil Pencarian:** Tabel daftar jadwal kapal yang sesuai dengan pencarian, menampilkan nama kapal, waktu keberangkatan, waktu tiba, dan status terkini.
* **Visual:** Desain modern, responsif (bisa dibuka di HP), dan interaktif.

**B. Halaman Admin (CMS)**
* **Dashboard:** Ringkasan jumlah kapal, jadwal hari ini, dll.
* **Manajemen Jadwal:** Tabel CRUD (Create, Read, Update, Delete) untuk jadwal.
* **Manajemen Kapal & Pelabuhan:** Halaman untuk menambah/mengedit data master kapal dan pelabuhan.

---

## 5. Rencana Langkah Implementasi (Step-by-Step)

**Fase 1: Setup & Database**
1. Inisialisasi folder proyek.
2. Buat database MySQL dan jalankan query pembuatan tabel (DDL).

**Fase 2: Backend (Express.js)**
1. Inisialisasi Express (`npm init -y`, `npm install express mysql2 cors dotenv`).
2. Buat koneksi database.
3. Buat model/query dan controller untuk API Jadwal, Kapal, dan Pelabuhan.
4. Uji API menggunakan Postman atau REST Client.

**Fase 3: Frontend (React.js)**
1. Inisialisasi React menggunakan Vite (`npm create vite@latest frontend -- --template react`).
2. Setup CSS framework (opsional, disarankan Tailwind CSS atau sekadar Vanilla CSS modern).
3. Buat komponen utama (Header, SearchForm, ScheduleTable).
4. Integrasi dengan Backend menggunakan `fetch` atau `axios`.

**Fase 4: Finalisasi**
1. Styling dan UI/UX Polish.
2. Testing flow (membuat jadwal di admin, melihat jadwal di halaman publik).

---

## Saran Teknologi/Library Tambahan:
* **Backend:** `sequelize` atau `prisma` (sebagai ORM jika tidak ingin menulis SQL mentah, sangat disarankan).
* **Frontend:** `axios` (untuk request API), `react-router-dom` (untuk navigasi halaman web), `lucide-react` (untuk ikon).
