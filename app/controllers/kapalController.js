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
        const kapalBaru = await Kapal.create({ nama_kapal, jenis_kapal, kapasitas });
        res.status(201).json(kapalBaru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
