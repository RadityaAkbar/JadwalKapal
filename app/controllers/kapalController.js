const Kapal = require('../models/Kapal');

// Mendapatkan semua kapal
exports.getAllKapal = async (req, res) => {
    try {
        const kapal = await Kapal.findAll();
        res.json(kapal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menambahkan kapal baru
exports.createKapal = async (req, res) => {
    try {
        const { nama_kapal, jenis_kapal, kapasitas } = req.body;
        if (!nama_kapal || !jenis_kapal || !kapasitas) {
            return res.status(400).json({ message: 'Semua bidang wajib diisi' });
        }
        const kapalBaru = await Kapal.create({ nama_kapal, jenis_kapal, kapasitas });
        res.status(201).json(kapalBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus kapal
exports.deleteKapal = async (req, res) => {
    try {
        const { id } = req.params;
        await Kapal.destroy({ where: { id } });
        res.json({ message: 'Kapal berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
