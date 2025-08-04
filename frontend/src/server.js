import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    console.log(`🔌 Novo usuário conectado: ${socket.id}`)

    socket.on('message', (msg) => {
        console.log('📨 Mensagem recebida:', msg)
        io.emit('message', msg)
    })

    socket.on('disconnenpx ts-node server.tsct', () => {
        console.log(`❌ Usuário desconectado: ${socket.id}`)
    })
})

httpServer.listen(3001, () => {
    console.log('✅ Servidor WebSocket rodando em http://localhost:3001')
})