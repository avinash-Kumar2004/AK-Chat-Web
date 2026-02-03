import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { ConnectDB } from './lib/db.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
    credentials: true
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // SPA fallback (Express v5 compatible)
    app.use((req, res) => {
        res.sendFile(
            path.join(__dirname, '../frontend', 'dist', 'index.html')
        );
    });
}



// Optional error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(PORT, async () => {
    try {
        await ConnectDB();
        console.log(`server is running on port ${PORT}`);
    } catch (err) {
        console.error('DB connection failed:', err);
    }
});