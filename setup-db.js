const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createDatabase() {
  try {
    console.log("Menghubungkan ke MySQL...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    const dbName = process.env.DB_NAME || 'jadwal_kapal_db';
    console.log(`Membuat database '${dbName}' jika belum ada...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log("Database siap!");
    await connection.end();
    
    console.log("Melakukan sinkronisasi tabel via Sequelize...");
    const sequelize = require('./config/db');
    const Admin = require('./app/models/Admin');
    const Kapal = require('./app/models/Kapal');
    const Pelabuhan = require('./app/models/Pelabuhan');
    const Jadwal = require('./app/models/Jadwal');
    
    await sequelize.sync({ alter: true });
    console.log("Tabel berhasil disinkronisasi!");

    // 1. Seed Admin Default jika belum ada
    const existingAdmin = await Admin.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        nama: 'Administrator Pelabuhan',
        role: 'admin'
      });
      console.log("-> Admin default dibuat (username: admin, password: admin123)");
    } else {
      console.log("-> Admin default sudah ada.");
    }

    // 2. Seed Pelabuhan jika masih kosong
    const countPelabuhan = await Pelabuhan.count();
    let pMerak, pBakauheni, pTanjungPriok, pKetapang;
    if (countPelabuhan === 0) {
      pMerak = await Pelabuhan.create({ nama_pelabuhan: 'Pelabuhan Merak', kota: 'Cilegon, Banten' });
      pBakauheni = await Pelabuhan.create({ nama_pelabuhan: 'Pelabuhan Bakauheni', kota: 'Lampung Selatan' });
      pTanjungPriok = await Pelabuhan.create({ nama_pelabuhan: 'Pelabuhan Tanjung Priok', kota: 'Jakarta Utara' });
      pKetapang = await Pelabuhan.create({ nama_pelabuhan: 'Pelabuhan Ketapang', kota: 'Banyuwangi, Jatim' });
      console.log("-> Data contoh Pelabuhan berhasil dibuat.");
    } else {
      const pelabuhans = await Pelabuhan.findAll();
      pMerak = pelabuhans[0];
      pBakauheni = pelabuhans[1] || pelabuhans[0];
      pTanjungPriok = pelabuhans[2] || pelabuhans[0];
      pKetapang = pelabuhans[3] || pelabuhans[0];
    }

    // 3. Seed Kapal jika masih kosong
    const countKapal = await Kapal.count();
    let k1, k2, k3;
    if (countKapal === 0) {
      k1 = await Kapal.create({ nama_kapal: 'KMP Portlink III', jenis_kapal: 'Ro-Ro Eksekutif', kapasitas: 850 });
      k2 = await Kapal.create({ nama_kapal: 'KM Kelud', jenis_kapal: 'Kapal Penumpang', kapasitas: 2000 });
      k3 = await Kapal.create({ nama_kapal: 'KMP Batumandi', jenis_kapal: 'Feri Cepat', kapasitas: 600 });
      console.log("-> Data contoh Kapal berhasil dibuat.");
    } else {
      const kapals = await Kapal.findAll();
      k1 = kapals[0];
      k2 = kapals[1] || kapals[0];
      k3 = kapals[2] || kapals[0];
    }

    // 4. Seed Jadwal jika masih kosong
    const countJadwal = await Jadwal.count();
    if (countJadwal === 0 && k1 && pMerak && pBakauheni) {
      const now = new Date();
      
      const t1Berangkat = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 jam lagi
      const t1Tiba = new Date(now.getTime() + 4 * 60 * 60 * 1000);

      const t2Berangkat = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const t2Tiba = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      const t3Berangkat = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 jam lalu (berangkat)
      const t3Tiba = new Date(now.getTime() + 1 * 60 * 60 * 1000);

      await Jadwal.create({
        kapal_id: k1.id,
        pelabuhan_asal_id: pMerak.id,
        pelabuhan_tujuan_id: pBakauheni.id,
        waktu_berangkat: t1Berangkat,
        waktu_tiba: t1Tiba,
        status: 'Terjadwal'
      });

      await Jadwal.create({
        kapal_id: k2.id,
        pelabuhan_asal_id: pTanjungPriok.id,
        pelabuhan_tujuan_id: pBakauheni.id,
        waktu_berangkat: t2Berangkat,
        waktu_tiba: t2Tiba,
        status: 'Terjadwal'
      });

      await Jadwal.create({
        kapal_id: k3.id,
        pelabuhan_asal_id: pBakauheni.id,
        pelabuhan_tujuan_id: pMerak.id,
        waktu_berangkat: t3Berangkat,
        waktu_tiba: t3Tiba,
        status: 'Berangkat'
      });
      console.log("-> Data contoh Jadwal berhasil dibuat.");
    }

    console.log("SETUP DATABASE & SEEDING SELESAI DENGAN SUKSES! ✨");
    process.exit(0);
  } catch (error) {
    console.error("Gagal setup database:", error);
    process.exit(1);
  }
}

createDatabase();
