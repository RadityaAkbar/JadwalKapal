const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Kapal = sequelize.define('Kapal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_kapal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis_kapal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kapasitas: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'kapal',
    timestamps: false
});

module.exports = Kapal;
