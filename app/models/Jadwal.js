const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Kapal = require('./Kapal');
const Pelabuhan = require('./Pelabuhan');

const Jadwal = sequelize.define('Jadwal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kapal_id: {
        type: DataTypes.INTEGER,
        references: { model: Kapal, key: 'id' }
    },
    pelabuhan_asal_id: {
        type: DataTypes.INTEGER,
        references: { model: Pelabuhan, key: 'id' }
    },
    pelabuhan_tujuan_id: {
        type: DataTypes.INTEGER,
        references: { model: Pelabuhan, key: 'id' }
    },
    waktu_berangkat: {
        type: DataTypes.DATE,
        allowNull: false
    },
    waktu_tiba: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Terjadwal', 'Berangkat', 'Tiba', 'Tertunda', 'Batal'),
        defaultValue: 'Terjadwal'
    }
}, {
    tableName: 'jadwal',
    timestamps: false
});

// Relasi antar tabel
Kapal.hasMany(Jadwal, { foreignKey: 'kapal_id' });
Jadwal.belongsTo(Kapal, { foreignKey: 'kapal_id' });

Pelabuhan.hasMany(Jadwal, { foreignKey: 'pelabuhan_asal_id', as: 'Keberangkatan' });
Jadwal.belongsTo(Pelabuhan, { foreignKey: 'pelabuhan_asal_id', as: 'PelabuhanAsal' });

Pelabuhan.hasMany(Jadwal, { foreignKey: 'pelabuhan_tujuan_id', as: 'Kedatangan' });
Jadwal.belongsTo(Pelabuhan, { foreignKey: 'pelabuhan_tujuan_id', as: 'PelabuhanTujuan' });

module.exports = Jadwal;
