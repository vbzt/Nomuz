'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ChatUser {
  user_id: string;
  user_name: string;
  user: { id: string; name: string };
}

interface Chat {
  id: string;
  isGroup: boolean;
  name?: string | null;
  users: ChatUser[];
  lastMessage?: { text: string; createdAt: string };
}



export default function ChatList() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  async function parseJwt(token: string) {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login falhou');

      const data = await res.json();
      setLoggedIn(true);

      const payload = await parseJwt(data.token);
      if (payload && payload.name) setUser(payload.name);
    } catch (err: any) {
      setError('Erro no login');
    }
  }

  useEffect(() => {
    if (!loggedIn) return;

    fetch('http://localhost:3001/chats', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar chats');
        return res.json();
      })
      .then((data) => {
        setChats(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loggedIn]);

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
      <h1>📜 Lista de Chats</h1>
      {chats.length === 0 && <p>Nenhum chat encontrado.</p>}
      <ul>
        {chats.map((chat) => {
  const otherUser = chat.users.find((u) => u.user.name !== user);
  const chatName = chat.isGroup
    ? chat.name || 'Grupo sem nome'
    : otherUser?.user.name || 'Chat sem nome';

  return (
    <li key={chat.id}>
      <Link href={`/chat/${chat.id}`} legacyBehavior>
        <a>
          <strong>{chatName}</strong>
          {chat.lastMessage && (
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
              {chat.lastMessage.text}
            </p>
          )}
        </a>
      </Link>
    </li>
  );
        })}
      </ul>
    </div>
  );
}
