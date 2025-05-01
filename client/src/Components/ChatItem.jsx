import React, { useState, useRef } from 'react';
import { useDeleteFriend } from '../hooks/useDeleteFriend';

const Avatar = ({ type = 'initials', value, color = 'bg-blue-500' }) => {
    if (type === 'image' && value) {
        return (
            <img
                className="w-12 h-12 rounded-full object-cover bg-gray-700"
                src={value}
                alt="User Avatar"
                loading="lazy"
            />
        );
    }
    const initials = typeof value === 'string' ? value.substring(0, 2).toUpperCase() : '??';
    return (
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-xl font-semibold text-white`}>
            {initials}
        </div>
    );
};

export default function ChatItem({ chat, isActive, onSelect }) {
    const { deleteFriendId, loading } = useDeleteFriend();
    const [showDelete, setShowDelete] = useState(false);
    const timerRef = useRef(null);

    const backgroundClass = isActive ? 'bg-tg-active-bg' : 'hover:bg-tg-hover-bg';
    const previewColorClass = isActive ? 'text-white' : 'text-gray-400';
    const active = isActive ? 'bg-[#8774e1]' : '';

    const handleContextMenu = (e) => {
        e.preventDefault();
        setShowDelete(true);
    };

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => {
            setShowDelete(true);
        }, 600);
    };

    const handleTouchEnd = () => {
        clearTimeout(timerRef.current);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        await deleteFriendId(chat._id);
        setShowDelete(false);
    };

    return (
        <li
            className={`relative flex items-center space-x-3 p-2 ${backgroundClass} cursor-pointer mx-1 rounded-lg ${active}`}
            onClick={() => onSelect(chat._id)}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-shrink-0">
                <Avatar type={chat.avatarType} value={chat.firstName} color={chat.avatarColor} />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-white truncate">{chat.firstName}</span>
                    <span className="text-xs text-white flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-sm ${previewColorClass} truncate pr-1`}>
                        {chat.message}
                    </p>
                    {chat.unreadCount > 0 && (
                        <span className="ml-auto flex-shrink-0 text-xs bg-tg-accent text-white rounded-full px-1.5 py-0.5 font-medium">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {showDelete && (
                <button
                    className="absolute right-2 top-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            )}
        </li>
    );
}
