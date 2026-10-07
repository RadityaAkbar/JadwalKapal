const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Pelabuhan = sequelize.define('Pelabuhan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_pelabuhan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kota: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'pelabuhan',
    timestamps: false
});

module.exports = Pelabuhan;
