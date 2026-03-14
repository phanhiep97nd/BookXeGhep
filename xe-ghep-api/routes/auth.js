const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const users = require('../models/account'); // Assuming you have an account model

const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     const userExists = users.find(u => u.username === username);
//     if (userExists) return res.status(400).json({ msg: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { username, password: hashedPassword };
//     users.push(newUser);

//     res.json({ msg: 'User registered successfully' });
// });

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await users.findOne({ userName: username });
        if (!user) return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });

        // So sánh mật khẩu (timing-safe comparison)
        const crypto = require('crypto');
        const inputBuf = Buffer.from(password);
        const storedBuf = Buffer.from(user.hashcode);
        const match = inputBuf.length === storedBuf.length &&
            crypto.timingSafeEqual(inputBuf, storedBuf);
        if (!match) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // Tạo payload và token
        const payload = {
            user: {
                username: user.userName
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// Protected Route
router.get('/me', authMiddleware, (req, res) => {
    res.json({ msg: 'This is a protected route', user: req.user });
});

module.exports = router;
