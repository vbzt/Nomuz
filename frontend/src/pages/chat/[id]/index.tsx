'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: string;
  sender?: { id: string; name: string };
}

interface ChatUser {
  user_name: string;
  user: { id: string; name: string };
}

interface ReadReceipt {
  [messageId: string]: 'Sent' | 'Received' | 'Read';
}

export default function ChatPage() {
  const params = useParams() as { id?: string } | null;
  const id = params?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [readReceipts, setReadReceipts] = useState<ReadReceipt>({});
  const [userId, setUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Pega info do usuário logado
  useEffect(() => {
    fetch('http://localhost:3001/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUserId(data.id))
      .catch(console.error);
  }, []);

  // Busca mensagens e participantes
  useEffect(() => {
    if (!id || !userId) return;
    setLoading(true);
    fetch(`http://localhost:3001/chats/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
          setUsers(Array.isArray(res.data.users) ? res.data.users : []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, userId]);

  // Conexão WebSocket
  useEffect(() => {
    if (!id || !userId) return;
    const socket = io('http://localhost:3005', { withCredentials: true, transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('joinChat', id);

    // Recebe novas mensagens
    socket.on('message', (res: { success: boolean; message: string; data: Message }) => {
      if (res.success && res.data) {
        const msg = res.data;
        setMessages(prev => [...prev, msg]);

        // Marcar automaticamente como "Received" para o remetente (apenas local)
        if (msg.sender_id === userId) {
          setReadReceipts(prev => ({ ...prev, [msg.id]: 'Sent' }));
        }
      }
    });

    // Atualiza read receipt apenas para o remetente
    socket.on('message.read', ({ messageId, userId: readerId }: { messageId: string; userId: string }) => {
      setReadReceipts(prev => {
        // Atualiza somente se eu sou o remetente
        const message = messages.find(m => m.id === messageId);
        if (message?.sender_id !== userId) return prev;
        return { ...prev, [messageId]: 'Read' };
      });
    });

    return () => {
      socket.emit('leaveChat', id);
      socket.disconnect();
    };
  }, [id, userId, messages]);

  // Scroll automático + envia read receipt de todas as mensagens recebidas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!id || !userId || !socketRef.current) return;

    messages.forEach(msg => {
      // Se a mensagem não é minha e ainda não foi marcada como lida
      if (msg.sender_id !== userId) {
        socketRef.current!.emit('readMessage', { chatId: id, messageId: msg.id });
      }
    });
  }, [messages, id, userId]);

  // Envia nova mensagem
  const sendMessage = () => {
    if (!newMessage.trim() || !id || !socketRef.current || !userId) return;
    socketRef.current.emit(
      'sendMessage',
      { id, content: newMessage },
      (res: { success: boolean; message: string; data: Message }) => {
        if (res.success && res.data) {
          const msg = res.data;
          setMessages(prev => [...prev, msg]);
          setReadReceipts(prev => ({ ...prev, [msg.id]: 'Sent' }));
          setNewMessage('');
        }
      }
    );
  };

  const getSenderName = (msg: Message) => {
    const user = users.find(u => u.user.id === msg.sender_id);
    return user?.user_name ?? msg.sender?.name ?? msg.sender_id;
  };

  return (
    <main className="p-5 min-h-[calc(100vh-65px)] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Chat {id}</h2>

      {loading ? (
        <p className="text-gray-400">Carregando mensagens...</p>
      ) : (
        <div className="border bg-[#0c0c13] rounded-xl p-4 h-[360px] w-full max-w-[700px] overflow-y-auto mb-4 flex flex-col gap-2">
          {messages.length === 0 ? (
            <p className="text-gray-500">Nenhuma mensagem ainda.</p>
          ) : (
            messages.map(m => {
              const isSender = m.sender_id === userId;
              const status = isSender ? readReceipts[m.id] ?? 'Sent' : undefined; // só o remetente vê o status
              return (
                <div key={m.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`max-w-[70%] px-3 py-2 rounded-lg ${isSender ? 'bg-[#36577d] text-white' : 'bg-[#272727] text-gray-200'}`}>
                    {!isSender && (
                      <div className="text-sm mb-1">
                        <strong className="text-[#4677af]">{getSenderName(m)}</strong>
                      </div>
                    )}
                    <div>{m.content}</div>
                    {status && <div className="text-xs text-gray-400 mt-1 text-right">{status}</div>}
                  </div>
                </div>
              );
            })
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
