const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jadwalkapal_secret_jwt_key_2026';

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi' });
        }

        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        // Cek password hash atau plain text (fallback)
        let isMatch = false;
        if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, admin.password);
        } else {
            isMatch = admin.password === password;
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, nama: admin.nama, role: admin.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                nama: admin.nama,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error saat login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token tidak tersedia' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const admin = await Admin.findByPk(decoded.id, {
            attributes: ['id', 'username', 'nama', 'role', 'createdAt']
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin tidak ditemukan' });
        }

        res.json({ admin });
    } catch (error) {
        return res.status(401).json({ message: 'Sesi telah kedaluwarsa atau token tidak valid' });
    }
};
