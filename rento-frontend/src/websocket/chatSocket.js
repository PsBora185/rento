import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getToken, getUser } from '../utils/token';

// WebSocket client singleton with reconnect logic
class ChatSocket {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageCallback = null;
    this.typingCallback = null;
    this.backoff = 1000;
    this.maxBackoff = 30000;
  }

  _getEndpoint() {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    // Remove trailing /api if user set VITE_API_BASE_URL to api root
    const base = apiBase.replace(/\/api$/, '').replace(/\/$/, '');
    // Backend WS endpoint is /ws-chat
    return `${base}/ws-chat`;
  }

  connect() {
    if (this.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const token = getToken();
      const endpoint = this._getEndpoint();

      this.client = new Client({
        // Use SockJS for fallback
        webSocketFactory: () => new SockJS(endpoint),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        debug: (str) => {
          // uncomment for debugging
          // console.debug('[STOMP]', str);
        },
        onConnect: () => {
          this.connected = true;
          this.backoff = 1000;
          // subscribe to user-specific queues
          const user = getUser();
          if (user?.id) {
            // messages
            this._subscribe(`/user/${user.id}/queue/messages`, (msg) => {
              if (this.messageCallback) {
                try {
                  const payload = JSON.parse(msg.body);
                  this.messageCallback(payload);
                } catch (e) {}
              }
            });

            // typing (optional)
            this._subscribe(`/user/${user.id}/queue/typing`, (msg) => {
              if (this.typingCallback) {
                try {
                  const payload = JSON.parse(msg.body);
                  this.typingCallback(payload);
                } catch (e) {}
              }
            });
          }

          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        },
        onWebSocketClose: () => {
          this.connected = false;
          this._tryReconnect();
        },
      });

      this.client.activate();

      // Short timeout guard
      setTimeout(() => {
        if (!this.connected) {
          // still not connected — attempt reconnect logic handled in onWebSocketClose
          reject(new Error('Unable to connect to chat server'));
        }
      }, 5000);
    });
  }

  _tryReconnect() {
    setTimeout(() => {
      if (this.connected) return;
      this.connect().catch(() => {
        this.backoff = Math.min(this.backoff * 2, this.maxBackoff);
        this._tryReconnect();
      });
    }, this.backoff);
  }

  _subscribe(destination, callback) {
    if (!this.client || !this.client.connected) return;
    if (this.subscriptions.has(destination)) return;

    const sub = this.client.subscribe(destination, callback);
    this.subscriptions.set(destination, sub);
  }

  _unsubscribe(destination) {
    const sub = this.subscriptions.get(destination);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  subscribeToMessages(cb) {
    this.messageCallback = cb;
    // If already connected, subscription happened in onConnect — nothing more to do
  }

  subscribeToTyping(cb) {
    this.typingCallback = cb;
  }

  subscribeToConversation(conversationId) {
    if (!this.client || !this.client.connected) return;
    const destination = `/topic/chat/${conversationId}`;
    this._subscribe(destination, (msg) => {
      try {
        const payload = JSON.parse(msg.body);
        if (this.messageCallback) {
          this.messageCallback(payload);
        }
      } catch (e) {
        console.error('Failed to parse message', e);
      }
    });
  }

  unsubscribeFromConversation(conversationId) {
    const destination = `/topic/chat/${conversationId}`;
    this._unsubscribe(destination);
  }

  sendMessage({ conversationId, roomId, content, mediaUrl = null, mediaType = 'NONE' }) {
    if (!this.client || !this.client.connected) return Promise.reject(new Error('Not connected'));
    const payload = JSON.stringify({ conversationId, roomId, content, mediaUrl, mediaType });
    this.client.publish({ destination: '/app/chat.send', body: payload });
    return Promise.resolve();
  }

  sendTyping({ conversationId, isTyping = true }) {
    if (!this.client || !this.client.connected) return;
    const payload = JSON.stringify({ conversationId, isTyping });
    this.client.publish({ destination: '/app/chat.typing', body: payload });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.subscriptions.clear();
    }
  }
}

const chatSocket = new ChatSocket();
export default chatSocket;
