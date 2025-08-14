'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender_id?: string;
  senderName?: string; // se o backend devolver
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const params = useParams() as { id?: string } | null;
  const id = params?.id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);

  // --- carrega histórico do backend (usa endpoint /chat/:id tal qual existe) ---
  useEffect(() => {
    mountedRef.current = true;
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3001/chat/${id}`, {
      method: 'GET',
      credentials: 'include', // envia cookie HttpOnly
      headers: { 'Accept': 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Falha ao carregar histórico (${res.status}) ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        // O backend talvez retorne { messages: [...] } ou uma lista direta.
        // Compatibilidade: tenta normalizar para array de mensagens.
        const msgs: Message[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
          ? data.messages
          : [];
        if (mountedRef.current) setMessages(msgs);
      })
      .catch((err) => {
        console.error('Erro ao carregar mensagens:', err);
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  // --- conecta o socket e entra na sala ---
useEffect(() => {
  if (!id) return;
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3005', {
      withCredentials: true,
      transports: ['websocket'],
    });
  }

  const s = socketRef.current;

  const onConnect = () => {
    s.emit('joinChat', id);

    // Listener de mensagens
    const onMessage = (msg: Message) => {
      console.log('Mensagem recebida no front:', msg);
      setMessages(prev => [...prev, msg]);
    };
    s.off('message', onMessage); // previne duplicidade
    s.on('message', onMessage);
  };

  if (s.connected) {
    onConnect();
  } else {
    s.once('connect', onConnect);
  }

  return () => {
    s.emit('leaveChat', id);
    s.off('message');
  };
}, [id]);


  const sendMessage = () => {
    if (!newMessage.trim() || !id) return;
    const s = socketRef.current;
    if (!s || !s.connected) {
      console.warn('socket não conectado');
      return;
    }
    s.emit('sendMessage', { id, content: newMessage });
    setNewMessage('');
  };

  // --- UI ---
  if (!id) {
    return <div style={{ padding: 20 }}>Carregando chat...</div>;
  }

  return (
    <main className="p-5 min-h-[calc(100vh-65px)] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Chat {id}</h2>

      {socketError && (
        <div className="text-orange-400 mb-2 bg-orange-400/10 px-3 py-2 rounded-lg w-full max-w-[700px]">
          Socket error: {socketError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Carregando mensagens...</p>
      ) : (
        <div
          className="border border-[#272727] bg-[#0c0c13] rounded-xl p-4 h-[360px] w-full max-w-[700px] overflow-y-auto mb-4 shadow-lg"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#36577d transparent"
          }}
        >
          {messages.length === 0 ? (
            <p className="text-gray-500">Nenhuma mensagem ainda.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="mb-4">
                <div className="text-sm text-gray-300">
                  <strong className="text-[#4677af]">
                    {m.senderName ?? m.sender_id ?? '—'}
                  </strong>{" "}
                  <small className="text-gray-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="mt-1 text-gray-200">{m.content}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex gap-2 w-full max-w-[700px]">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-[#15151e] border border-[#272727] rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#36577d] transition"
        />
        <button
          onClick={sendMessage}
          className="bg-[#36577d] hover:bg-[#254161] text-white px-4 py-2 rounded-lg transition font-semibold"
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
