import api from './axios';

export const chatAPI = {
  // Get conversations for logged-in user
  getConversations: () => api.get('/chat/conversations'),

  // Get messages for a conversation
  getMessages: (conversationId, params = {}) => api.get(`/chat/${conversationId}/messages`, { params }),

  // Start conversation for a room (returns conversation object)
  startConversation: (roomId) => api.post(`/chat/start/${roomId}`),

  // Optionally expose REST send (we mainly rely on WS sending)
  sendMessageRest: (payload) => api.post('/chat/send', payload),
};
