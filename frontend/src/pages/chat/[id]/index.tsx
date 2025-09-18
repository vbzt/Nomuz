'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { TbPaperclip } from "react-icons/tb";
import { TbSend2 } from "react-icons/tb";
import { TbMenu, TbArrowLeft, TbSearch } from "react-icons/tb";

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
    <main className="py-[15px] min-h-[calc(100vh-65px)] flex flex-col items-center w-full">
      <div className='flex items-center justify-between flex-col max-w-[1000px] w-[90%] h-full flex-1'>
        <div className='w-full border border-[#15151e] flex items-center justify-between rounded-[8px] p-2'>
          <div className='flex flex-row items-center justify-center'>
            <img src="/image.jpg" width={40} height={40} alt="Image user" className="h-[40px] w-[40px] rounded-[5px] mr-[10px]" />
            <h1>{id}</h1>
          </div>
          <div>
            <button className='h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbArrowLeft />
            </button>
            <button className='ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbSearch />
            </button>
            <button className='ml-[10px] h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
              <TbMenu />
            </button>
          </div>
        </div>

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
        <footer className='w-full flex items-center justify-center gap-[10px]'>
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="text-[15px] flex-1 h-[40px] w-full bg-[#15151e] transition duration-[0.2s] ease-in-out  border border-[#272727] rounded-[10px] px-[16px] py-[8px] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d]"
          />
          <button className='h-[40px] px-[11px] py-[10px] bg-[#0c0c13] border border-[#15151e] rounded-[10px] hover:bg-[#ffffff0a] transition duration-[0.2s] cursor-pointer ease-in-out'>
            <TbPaperclip />
          </button>
          <button
            onClick={sendMessage}
            className="h-[40px]  bg-[#36577d] hover:bg-[#254161] transition duration-[0.2s] cursor-pointer ease-in-out text-white px-[11px] py-[10px] rounded-[10px] font-semibold"
          >
            <TbSend2 />
          </button>
        </footer>
      </div>
    </main>
  );
}
