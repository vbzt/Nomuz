'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
}

export default function ChatId() {
  const { id } = useParams<{ id: string }>(); // 
  const [messages, setMessages] = useState<Message[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Checa se o usuário está logado
  useEffect(() => {
    fetch('http://localhost:3001/auth/me', {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) setLoggedIn(true);
        else setLoggedIn(false);
      })
      .catch(() => setLoggedIn(false));
  }, []);

  useEffect(() => {
    if (!loggedIn || !id) return;

    fetch(`http://localhost:3001/chat/${id}/`, {
      method: 'GET',    
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar mensagens');
        return res.json();
      })
      .then((data) => {
        setMessages(data?.messages || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Erro ao carregar mensagens');
      });
  }, [loggedIn, id]);

  if (!loggedIn) {
    return <p>Você precisa estar logado para ver este chat.</p>;
  }

  return (
    <main>
      <h2>Mensagens do Chat</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {messages.length === 0 ? (
        <p>Nenhuma mensagem ainda.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.sender_id}</strong>: {msg.content}
              <br />
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
