import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  ExternalLink,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import type { ChatMessage, AgentInfo } from '../types/index.ts';
import { generateConciergeReply } from '../utils/authAndReviews.ts';
import { BRAND_INFO } from '../data/catalog.ts';

interface ChatSupportWidgetProps {
  currentUserName?: string;
}

export const ChatSupportWidget: React.FC<ChatSupportWidgetProps> = ({ currentUserName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const [agent] = useState<AgentInfo>({
    name: 'Atir Rais',
    role: 'Executive Director & Master Coppersmith',
    avatarInitials: 'AR',
    status: 'Online',
    typicalResponseTime: '< 2 mins',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'agent',
      senderName: 'Atir Rais (Director)',
      text: `Adab & Welcome to TAG ZEE Moradabad! I am Atir Rais. Whether you need custom dimensions for our hand-hammered brass urns, export container pricing, or courier dispatch tracking, I am at your service.`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      senderName: currentUserName || 'Guest Connoisseur',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic concierge response simulation
    setTimeout(() => {
      const replyText = generateConciergeReply(text);
      const agentReply: ChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        senderName: 'Atir Rais (Director)',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, agentReply]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    }, 700);
  };

  const quickPrompts = [
    'Custom brass casting dimensions',
    'Track my dispatch AWB',
    '99.8% purity & anti-tarnish guarantee',
    'Wholesale container export MOQ',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      {/* Collapsed Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Moradabad Atelier live chat"
          className="relative group p-3.5 bg-[#111827] text-white rounded-full shadow-2xl border-2 border-[#D4AF37] hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 text-[#D4AF37]" />

          {/* Live Online Pulse Dot */}
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111827]" />

          {/* Unread Message Pill */}
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
              {unreadCount}
            </span>
          )}

          <div className="hidden lg:group-hover:flex absolute right-full mr-3 bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-lg border border-[#D4AF37]/40 text-xs font-semibold whitespace-nowrap items-center gap-1.5">
            <span>Chat with Atir Rais</span>
            <span className="text-[10px] text-emerald-700">● Online</span>
          </div>
        </button>
      )}

      {/* Expanded Live Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-white rounded-2xl shadow-2xl border-2 border-[#D4AF37]/50 flex flex-col overflow-hidden animate-fadeIn text-slate-900">
          {/* Top Atelier Agent Header */}
          <div className="bg-[#111827] text-white p-4 border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F5D061] to-[#AA7C11] text-slate-950 font-bold flex items-center justify-center font-serif text-sm shadow-xs border border-white/20">
                  {agent.avatarInitials}
                </div>
                {/* Active Status Ring */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111827]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white font-serif">{agent.name}</h4>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {agent.role} · Replies in {agent.typicalResponseTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Direct WhatsApp Call Line */}
              <a
                href={`https://wa.me/917351366786?text=Hello%20Atir%20Rais,%20inquiring%20via%20TAG%20ZEE%20Live%20Desk`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                title="Switch to WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompt Chips Bar */}
          <div className="bg-[#FAF9F5] p-2 border-b border-slate-200 overflow-x-auto scrollbar-none flex gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-[#D4AF37] rounded-full text-[10px] font-semibold text-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Message Scroll Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-radial from-[#FFFDF9] to-[#F7F4EC] text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 px-1 mb-0.5">
                    {msg.senderName} · {msg.timestamp}
                  </span>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-[#D4AF37]/30 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white/80 p-2 rounded-xl w-32 border border-slate-200">
                <span className="font-semibold">{agent.name} is typing</span>
                <span className="animate-pulse">...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & WhatsApp Handover Bar */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about alloy purity, dimensions, or AWB tracking..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-[#D4AF37] rounded-xl shadow-xs disabled:opacity-30 cursor-pointer transition-colors"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Moradabad Foundry Support Desk</span>
              <a
                href={`https://wa.me/917351366786?text=Hello%20Atir%20Rais`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9E7A1C] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>WhatsApp Desk</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
