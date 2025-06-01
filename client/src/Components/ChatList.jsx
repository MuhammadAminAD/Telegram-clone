import ChatItem from './ChatItem';

export default function ChatList({ chats = [], activeChatId, onChatSelect, loading }) {
  if (loading) {
    return <div className="p-4 text-center text-gray-400">Searching...</div>;
  }

  if (!chats.length) {
    return <div className="p-4 text-center text-gray-400">No users found.</div>;
  }

  return (
    <ul className="pt-1 px-2">
      {chats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isActive={chat._id === activeChatId}
          onSelect={onChatSelect}
        />
      ))}
    </ul>
  );
}
