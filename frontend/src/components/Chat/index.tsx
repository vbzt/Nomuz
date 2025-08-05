'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    socket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off('message')
    }
  }, [])
 
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message)
      setMessage('')
    }
  }

  return (
    <div>
      <h1>💬 Chat Teste</h1>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">{msg}</div>
        ))}
      </div>
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Digite sua mensagem..." />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  )
}