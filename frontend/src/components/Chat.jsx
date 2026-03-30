import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Paperclip, X, MessageSquare } from 'lucide-react';
import { sendChatMessage } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ projectId }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !projectId) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const data = await sendChatMessage(projectId, input);
            setMessages(data.history || [...messages, userMessage, { role: 'assistant', content: data.response }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] glass-card">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Bot className="text-primary-500" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">SmartNotes AI Assistant</h3>
                        <p className="text-xs text-slate-400">Ask anything about your notes</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="p-4 bg-white/5 rounded-full">
                            <MessageSquare size={40} className="text-slate-400" />
                        </div>
                        <p>No messages yet. Start by asking a question about your documents.</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`p-2 rounded-lg h-fit ${m.role === 'user' ? 'bg-primary-600' : 'bg-white/10'}`}>
                                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user'
                                ? 'bg-primary-600/10 border border-primary-500/20 text-white'
                                : 'bg-white/5 border border-white/10 text-slate-200'
                                }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex gap-4">
                        <div className="p-2 rounded-lg bg-white/10 h-fit">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                            <Loader2 className="animate-spin text-primary-500" size={20} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5 rounded-b-2xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question about the notes..."
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                    />
                    <div className="absolute left-4 text-slate-400">
                        <Paperclip size={18} />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
