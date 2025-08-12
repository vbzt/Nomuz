'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Chat() {
  const [user, setUser] = useState(''); // Nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ name: string; text: string }[]>([]); // Array de mensagens com nome
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para decodificar o JWT e pegar o payload
  async  function parseJwt(token: string) {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload); // decodifica base64
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  // Lógica para login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        credentials: 'include', // MUITO IMPORTANTE: permite salvar cookie HttpOnly
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Login falhou');
      }

      const data = await res.json();
      console.log(data)
      console.log('JWT token:', data.token.JWTtoken)
      setLoggedIn(true);

      const user = await parseJwt(data.token.JWTtoken);
      if (user && user.name) {
        setUser(user.name)
      }
    } catch (err: any) {
      console.log('eita olha o erro')
    }
  }

  // Conexão com o WebSocket após login
  useEffect(() => {
    if (!loggedIn) return

    const socketIo = io('http://localhost:3005', {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket(socketIo);

    // Escutando mensagens do servidor
socketIo.on('message', (msg: { name: string; text: string }) => {
  console.log('Received message:', msg); // Log the message

  // Check if the message format is correct
  if (msg && msg.name && typeof msg.text === 'string') {
    setMessages((prev) => [...prev, msg]);
  } else {
    console.error('Invalid message format:', msg);
  }
});

    // Cleanup ao desconectar
    return () => {
      socketIo.disconnect();
    };
  }, [loggedIn]);

  // Função para enviar mensagem
function sendMessage() {
  if (socket && message.trim()) {
    if (user.trim() === '') {
      console.error('User name is empty, cannot send message');
      return;
    }

    console.log('Sending message text:', message); // Só a string
    socket.emit('message', message); // envia só o texto da mensagem
    setMessage('');
  }
}


  // Se não estiver logado, exibe o formulário de login
  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Entrar</button>
      </form>
    );
  }

  return (
    <div>
      <h1>💬 Chat</h1>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}>
        {/* Exibe as mensagens com o nome do usuário */}
        {messages.map((msg, idx) => {
          if (msg && msg.name && msg.text) {
            return (
              <div key={idx}>
                <strong>{msg.name}: </strong>{msg.text}
              </div>
            );
          }
          return null; // Skip invalid message
        })}
      </div>
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
