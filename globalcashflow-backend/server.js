require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const SECRET_KEY = process.env.JWT_SECRET

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

mongoose.connect("mongodb+srv://ricardosantana942:p3GiKahsavH8jv6K@cashflow.p1iummv.mongodb.net/?retryWrites=true&w=majority&appName=CashFlow").then(() => {
    console.log('Connected to MongoDB successfully!');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.use(bodyParser.json());

// Token verification endpoint
app.post('/verify-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false });
        } else {
            return res.status(200).json({ valid: true });
        }
    });
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ email, user }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered', token });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
        res.send({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
