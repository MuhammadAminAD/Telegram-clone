// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= IMPORTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import { portPassword } from './middlewares/Password.middlewares.js';
import router from './routes/route.js';
import { connectDB } from './config/connectDatebaze.js';
import UserSchema from './schema/User.schema.js';
import './utils/cronCode.js';

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= INITIALIZE APP =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= SOCKET.IO SETUP =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const io = new Server(server, {
      cors: {
            origin: '*',
            methods: '*',
      },
});

io.on('connection', (socket) => {
      console.log('⚡ A user connected:', socket.id);

      socket.on('isOnline', async (data) => {
            try {
                  const user = await UserSchema.findOneAndUpdate(
                        { email: data.email },
                        { socketID: socket.id },
                        { new: true }
                  );

                  if (user && user._id) {
                        const roomName = `user_${user._id}`;
                        socket.join(roomName);
                        console.log(`Socket ${socket.id} joined room: ${roomName}`);
                  }
            } catch (error) {
                  console.error('Error updating user socketID or joining room:', error);
            }
      });

      socket.on('disconnect', async () => {
            try {
                  await UserSchema.findOneAndUpdate({ socketID: socket.id }, { socketID: null });
                  console.log('User disconnected:', socket.id);
            } catch (error) {
                  console.error('Error clearing socketID:', error);
            }
      });
});
export { io }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= CONSTANTS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
const PORT = process.env.PORT || 3333;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= DATABASE CONNECTION =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
connectDB();

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ROUTES =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.use('/', portPassword, router);

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= START SERVER =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
server.listen(PORT, () => {
      console.log(`✅ Server running successfully\n📡 Listening on port: ${PORT}\n`);
});
