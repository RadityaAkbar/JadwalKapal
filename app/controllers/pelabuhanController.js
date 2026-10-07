const Pelabuhan = require('../models/Pelabuhan');

exports.getAllPelabuhan = async (req, res) => {
    try {
        const pelabuhan = await Pelabuhan.findAll();
        res.json(pelabuhan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPelabuhan = async (req, res) => {
    try {
        const { nama_pelabuhan, kota } = req.body;
        if (!nama_pelabuhan || !kota) {
            return res.status(400).json({ message: 'Nama pelabuhan dan kota wajib diisi' });
        }
        const baru = await Pelabuhan.create({ nama_pelabuhan, kota });
        res.status(201).json(baru);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePelabuhan = async (req, res) => {
    try {
        const { id } = req.params;
        await Pelabuhan.destroy({ where: { id } });
        res.json({ message: 'Pelabuhan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
