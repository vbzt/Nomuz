'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

interface ChatUser {
  user_name: string;
  user: { id: string; name: string };
}

export default function ChatPage() {
  const params = useParams() as { id?: string } | null;
  const id = params?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    if (!id) return setLoading(false);

    setLoading(true);
    fetch(`http://localhost:3001/chats/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' },
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text().catch(() => ''));
        return res.json();
      })
      .then(data => {
        const msgs: Message[] = Array.isArray(data.messages) ? data.messages : [];
        const chatUsers: ChatUser[] = Array.isArray(data.users) ? data.users : [];
        if (mountedRef.current) {
          setMessages(msgs);
          setUsers(chatUsers);
        }
      })
      .catch(console.error)
      .finally(() => mountedRef.current && setLoading(false));

    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const socket = io('http://localhost:3005', { withCredentials: true, transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('joinChat', id);

    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.emit('leaveChat', id);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !id) return;
    socketRef.current?.emit('sendMessage', { id, content: newMessage });
    setNewMessage('');
  };

  const getSenderName = (msg: Message) => {
    const user = users.find(u => u.user.id === msg.sender_id);
    return user?.user_name ?? msg.sender.name ?? msg.sender_id;
  };

  return (
    <main className="p-5 min-h-[calc(100vh-65px)] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Chat {id}</h2>

      {loading ? (
        <p className="text-gray-400">Carregando mensagens...</p>
      ) : (
        <div className="border bg-[#0c0c13] rounded-xl p-4 h-[360px] w-full max-w-[700px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">Nenhuma mensagem ainda.</p>
          ) : (
            messages.map(m => (
              <div key={m.id} className="mb-4">
                <div className="text-sm text-gray-300">
                  <strong className="text-[#4677af]">{getSenderName(m)}</strong>{' '}
                  <small className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</small>
                </div>
                <div className="mt-1 text-gray-200">{m.content}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="flex gap-2 w-full max-w-[700px]">
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-[#15151e] border border-[#272727] rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d]"
        />
        <button
          onClick={sendMessage}
          className="bg-[#36577d] hover:bg-[#254161] text-white px-4 py-2 rounded-lg font-semibold"
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
