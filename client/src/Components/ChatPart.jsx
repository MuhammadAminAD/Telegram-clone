import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { isEqual } from 'lodash';
import ChatInput from '../Components/ChatInput';
import { socket } from '../utils/socket.io';
import { useDeleteMessage } from '../hooks/useDeleteMessage';
import { BiMessageX } from 'react-icons/bi';

export default function ChatPart({ data, ChatId, loading, setRefreshTrigger }) {
  const [allMessages, setAllMessages] = useState([]);
  const [showDelete, setShowDelete] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const bottomRef = useRef(null);

  const previousChatId = useRef(null);
  const previousMessages = useRef([]);

  const { deleteMessageId } = useDeleteMessage();

  const combined = useMemo(() => {
    if (!ChatId?._id || !data) return [];
    const sent = data?.send?.filter((m) => m.to === ChatId?._id) || [];
    const received = data?.receiver?.filter((m) => m.from === ChatId?._id) || [];
    return [...sent, ...received].sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [ChatId?._id, data]);

  useEffect(() => {
    const isNewChat = previousChatId.current !== ChatId?._id;
    const messagesChanged = !isEqual(previousMessages.current, combined);

    if ((isNewChat || messagesChanged) && !loading) {
      previousChatId.current = ChatId?._id;
      previousMessages.current = combined;
      setAllMessages(combined);
    }
  }, [ChatId?._id, combined, loading]);

    useEffect(() => {
      const handleNewMessage = (msg) => {
        if ((msg.to === ChatId?._id || msg.from === ChatId?._id) &&
            !allMessagesRef.current.some((m) => m._id === msg._id)) {
          setAllMessages((prev) => [...prev, msg]);
        }
      };

      socket.on('new_message', handleNewMessage);
      return () => socket.off('new_message', handleNewMessage);
    }, [ChatId?._id]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleDelete = useCallback((id) => {
    deleteMessageId(id);
    setAllMessages((prev) => prev.filter((m) => m._id !== id));
  }, [deleteMessageId]);

  const handleMouseDown = useCallback((id) => {
    setPressTimer(setTimeout(() => setShowDelete(id), 800));
  }, []);

  const handleMouseUp = useCallback(() => clearTimeout(pressTimer), [pressTimer]);

  if (loading && allMessages.length === 0) {
    return (
      <main className="mainBG flex-grow bg-tg-bg flex items-center justify-center p-4">
        <p className="text-gray-400">Loading chat...</p>
      </main>
    );
  }

  return (
    <main className="mainBG flex-grow bg-tg-bg flex flex-col items-center justify-between p-4 overflow-hidden">
      {allMessages.length > 0 ? (
        <div className="flex flex-col w-full h-[90%] z-10 overflow-y-auto p-4">
          {allMessages.map((msg) => {
            const isOwn = msg.to === ChatId?._id;
            return (
              <div
                key={msg._id}
                className={`relative group flex items-center mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowDelete(msg._id);
                }}
                onMouseDown={() => handleMouseDown(msg._id)}
                onMouseUp={handleMouseUp}
                onTouchStart={() => handleMouseDown(msg._id)}
                onTouchEnd={handleMouseUp}
              >
                <p className={`rounded-xl px-4 py-2 max-w-[700px] ${isOwn ? 'bg-amber-200 text-black' : 'bg-[#212121] text-amber-50'}`}>
                  {msg.text}
                  <span className="text-[10px] ml-2">{new Date(msg.time).toLocaleTimeString()}</span>
                </p>

                {showDelete === msg._id && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="absolute -top-0 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  >
                    <BiMessageX size={18} />
                  </button>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center text-gray-400 bg-[rgba(200,200,200,0.01)] backdrop-blur-sm px-20 py-10 rounded-2xl w-full h-full">
          <p className="mt-2">Select a chat to start messaging</p>
          <p className="text-sm mt-1">Or use the search bar to find people, groups, or channels.</p>
          <p className="text-sm mt-4 text-tg-accent">Built with React & Tailwind CSS</p>
        </div>
      )}
      <ChatInput id={ChatId?._id} setRefreshTrigger={setRefreshTrigger} />
    </main>
  );
}
