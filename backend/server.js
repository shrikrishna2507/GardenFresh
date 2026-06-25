import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app  = express();
const http = createServer(app);
const io   = new Server(http, { cors: { origin: process.env.FRONTEND_URL } });

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (_, res) => res.json({ message: '🌿 GardenFresh API running', version: '1.0.0' }));

// Socket.io — real-time order tracking
io.on('connection', (socket) => {
  socket.on('join-order', (orderId) => socket.join(`order-${orderId}`));
  socket.on('order-status-update', (data) => {
    io.to(`order-${data.orderId}`).emit('status-changed', data);
  });
  socket.on('disconnect', () => {});
});

app.set('io', io);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
