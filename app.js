import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';
import nonAdminRoutes from './routes/routes.js';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const APP_PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors({ origin: true }));
app.use(express.json());

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

app.get('/', (req, res) => {
    res.json({
        "Hello": "World",
        "Version": 2
    })
})

app.get('/api/health', (req, res) => {
    res.status(200).json({
        "healthy": true
    })
})

app.use('/api/user', userRoutes);
app.use('/api/admin', verifyToken, adminRoutes);
app.use('/api', verifyToken, nonAdminRoutes);
app.use('/api/file', verifyToken, fileRoutes);

app.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`)
})