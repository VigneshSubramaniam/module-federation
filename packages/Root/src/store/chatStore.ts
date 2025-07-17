import { createStore } from './createStore';
import { GlobalState, CacheStrategy } from '../types/store';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'system';
}

interface ChatState extends GlobalState {
  isOpen: boolean;
  messages: Message[];
  unreadCount: number;
  isTyping: boolean;
}

const chatConfig = {
  id: 'chatStore',
  initialState: {
    isOpen: false,
    messages: [],
    unreadCount: 0,
    isTyping: false
  },
  methods: (
    set: (state: Partial<ChatState>) => void,
    get: () => ChatState
  ) => ({
    toggleChat: () => {
      const { isOpen } = get();
      set({ 
        isOpen: !isOpen,
        unreadCount: isOpen ? get().unreadCount : 0 // Clear unread count when opening
      });
    },
    
    openChat: () => set({ isOpen: true, unreadCount: 0 }),
    
    closeChat: () => set({ isOpen: false }),
    
    addMessage: (text: string, sender: 'user' | 'system' = 'user') => {
      const { messages, isOpen } = get();
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now(),
        sender
      };
      
      set({ 
        messages: [...messages, newMessage],
        unreadCount: !isOpen && sender === 'system' ? get().unreadCount + 1 : get().unreadCount
      });
    },
    
    clearMessages: () => set({ messages: [], unreadCount: 0 }),
    
    setTyping: (isTyping: boolean) => set({ isTyping }),
    
    markAsRead: () => set({ unreadCount: 0 })
  }),
  cache: {
    expiryTime: 0, // Never expire
    strategy: 'session' as CacheStrategy, // Persist during browser session
    tabBehavior: 'persist' as any, // Not used for global stores but required by type
    clearOnRefresh: false,
    scope: 'global' as const // This makes it a global store
  }
};

export const useChatStore = createStore<ChatState>(chatConfig); 