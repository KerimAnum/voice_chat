const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', socket.id);

        socket.on('offer', (data) => {
            socket.to(data.target).emit('offer', {
                from: socket.id,
                offer: data.offer
            });
        });

        socket.on('answer', (data) => {
            socket.to(data.target).emit('answer', {
                from: socket.id,
                answer: data.answer
            });
        });

        socket.on('ice-candidate', (data) => {
            socket.to(data.target).emit('ice-candidate', {
                from: socket.id,
                candidate: data.candidate
            });
        });

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', socket.id);
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});