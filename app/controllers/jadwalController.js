const Jadwal = require('../models/Jadwal');
const Kapal = require('../models/Kapal');
const Pelabuhan = require('../models/Pelabuhan');
const { Op } = require('sequelize');

exports.getAllJadwal = async (req, res) => {
    try {
        const { search, status, asal, tujuan, tanggal } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (asal) {
            whereClause.pelabuhan_asal_id = asal;
        }

        if (tujuan) {
            whereClause.pelabuhan_tujuan_id = tujuan;
        }

        if (tanggal) {
            // Filter tanggal keberangkatan
            const startOfDay = new Date(`${tanggal}T00:00:00.000Z`);
            const endOfDay = new Date(`${tanggal}T23:59:59.999Z`);
            whereClause.waktu_berangkat = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const jadwal = await Jadwal.findAll({
            where: whereClause,
            include: [
                { model: Kapal },
                { model: Pelabuhan, as: 'PelabuhanAsal' },
                { model: Pelabuhan, as: 'PelabuhanTujuan' }
            ],
            order: [['waktu_berangkat', 'ASC']]
        });

        // Filter search term jika ada nama kapal atau kota
        let filtered = jadwal;
        if (search) {
            const term = search.toLowerCase();
            filtered = jadwal.filter(j => 
                (j.Kapal && j.Kapal.nama_kapal.toLowerCase().includes(term)) ||
                (j.PelabuhanAsal && j.PelabuhanAsal.nama_pelabuhan.toLowerCase().includes(term)) ||
                (j.PelabuhanTujuan && j.PelabuhanTujuan.nama_pelabuhan.toLowerCase().includes(term))
            );
        }

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createJadwal = async (req, res) => {
    try {
        const { kapal_id, pelabuhan_asal_id, pelabuhan_tujuan_id, waktu_berangkat, waktu_tiba, status } = req.body;
        
        if (!kapal_id || !pelabuhan_asal_id || !pelabuhan_tujuan_id || !waktu_berangkat || !waktu_tiba) {
            return res.status(400).json({ message: 'Semua bidang jadwal wajib diisi' });
        }

        const baru = await Jadwal.create({
            kapal_id,
            pelabuhan_asal_id,
            pelabuhan_tujuan_id,
            waktu_berangkat,
            waktu_tiba,
            status: status || 'Terjadwal'
        });

        const created = await Jadwal.findByPk(baru.id, {
            include: [
                { model: Kapal },
                { model: Pelabuhan, as: 'PelabuhanAsal' },
                { model: Pelabuhan, as: 'PelabuhanTujuan' }
            ]
        });

        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateJadwal = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, waktu_berangkat, waktu_tiba } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (waktu_berangkat) updateData.waktu_berangkat = waktu_berangkat;
        if (waktu_tiba) updateData.waktu_tiba = waktu_tiba;

        await Jadwal.update(updateData, { where: { id } });

        const updated = await Jadwal.findByPk(id, {
            include: [
                { model: Kapal },
                { model: Pelabuhan, as: 'PelabuhanAsal' },
                { model: Pelabuhan, as: 'PelabuhanTujuan' }
            ]
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteJadwal = async (req, res) => {
    try {
        const { id } = req.params;
        await Jadwal.destroy({ where: { id } });
        res.json({ message: 'Jadwal berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
