import { io, Socket } from 'socket.io-client';
import { Config } from '@/Config';
import { SOCKET_EVENTS } from '@/Constants/SocketEvents';
import { store } from '@/Jotai/Store';
import {
  chatMessagesAtom,
  typingUsersAtom,
  activeChannelIdAtom,
  objectAtomFamily,
  userTokenAtom,
} from '@/Jotai/Atoms';
import { AtomKeys } from '@/Jotai/AtomKeys';

class SocketService {
  private socket: Socket | null = null;
  private communityId: string | null = null;
  /** When join runs before CONNECT, reconnect handler flushes joining the channel */
  private joinChannelPendingFlush: string | null = null;

  private normalizeId(value: unknown): string | undefined {
    if (value == null) return undefined;
    if (typeof value === 'string') {
      const s = value.trim();
      return s.length ? s : undefined;
    }
    if (typeof value === 'object') {
      const o = value as any;
      if (typeof o?.toHexString === 'function') return o.toHexString();
      if (o._id != null) return String(o._id);
      if (o.id != null) return String(o.id);
      if (typeof o.$oid === 'string') return o.$oid;
    }
    return String(value);
  }

  /** Resolve channel list key consistently with ChannelChat (`_id`, `channel`, refs). */
  private resolveChannelId(payload: any, message: any): string | undefined {
    const fromPayload = this.normalizeId(payload?.channelId);
    if (fromPayload) return fromPayload;
    if (payload?.channel != null) return this.normalizeId(payload.channel);
    const fromMsg = this.normalizeId(
      message?.channelId ??
        message?.channel_id ??
        (typeof message?.channel === 'string'
          ? message.channel
          : message?.channel),
    );
    if (fromMsg) return fromMsg;
    const nested = message?.channel;
    return this.normalizeId(nested?._id ?? nested?.id ?? nested);
  }

  /** After creating the socket connection, subscribe to inbound chat events exactly once */
  private wireInboundChatRelay() {
    if (!this.socket) return;
    const inbound = SOCKET_EVENTS.INBOUND_NEW_MESSAGE_ALIAS;
    this.socket.off(inbound, this.boundInboundNewMessage);
    this.socket.on(inbound, this.boundInboundNewMessage);
  }

  private boundInboundNewMessage = (payload: any) => {
    const message = payload?.message ?? payload?.data ?? payload;
    const looksLikeChat =
      message &&
      typeof message === 'object' &&
      (message.channelId ||
        message.channel_id ||
        message.channel ||
        message.content != null ||
        message.text != null);
    if (looksLikeChat) {
      this.handleMessageReceived(payload);
    }
  };

  connect(token?: string) {
    const authToken = token || store.get(userTokenAtom);

    if (!authToken) {
      console.log('Socket: No token available, skipping connection');
      return;
    }

    if (this.socket?.connected) {
      console.log('Socket: Already connected');
      return;
    }

    console.log('Socket: Connecting to', Config.SOCKET_URL);
    this.socket = io(Config.SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      auth: {
        token: authToken,
      },
      query: {
        token: authToken,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket: Connected with ID', this.socket?.id);
      if (this.communityId) {
        this.joinCommunity(this.communityId);
      }

      const activeChannelId =
        store.get(activeChannelIdAtom) ?? this.joinChannelPendingFlush;
      if (activeChannelId) {
        this.flushJoinChannel(activeChannelId);
      }
    });

    this.socket.on('disconnect', reason => {
      console.log('Socket: Disconnected, reason:', reason);
    });

    this.socket.on('connect_error', error => {
      console.error('Socket: Connection error:', error);
    });

    // Remove all previous listeners before setting up new ones to avoid duplication
    this.socket.removeAllListeners(SOCKET_EVENTS.INBOUND_NEW_MESSAGE_ALIAS);
    this.socket.removeAllListeners(SOCKET_EVENTS.MESSAGE_RECEIVED);
    this.socket.removeAllListeners(SOCKET_EVENTS.MESSAGE_UPDATED_CLIENT);
    this.socket.removeAllListeners(SOCKET_EVENTS.MESSAGE_DELETED_CLIENT);
    this.socket.removeAllListeners(SOCKET_EVENTS.USER_TYPING);
    this.socket.removeAllListeners(SOCKET_EVENTS.USER_STOPPED_TYPING);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_CREATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_DELETED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_UPDATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_MEMBERS_UPDATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CONVERSATION_UPDATED);

    this.setupGlobalListeners();
    this.wireInboundChatRelay();
  }

  private setupGlobalListeners() {
    if (!this.socket) return;

    // Server -> Client Listeners
    this.socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, message => {
      this.handleMessageReceived(message);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_UPDATED_CLIENT, message => {
      this.handleMessageUpdated(message);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_DELETED_CLIENT, data => {
      this.handleMessageDeleted(data);
    });

    this.socket.on(SOCKET_EVENTS.USER_TYPING, data => {
      this.handleUserTyping(data, true);
    });

    this.socket.on(SOCKET_EVENTS.USER_STOPPED_TYPING, data => {
      this.handleUserTyping(data, false);
    });

    this.socket.on(SOCKET_EVENTS.CHANNEL_CREATED, channel => {
      this.handleChannelCreated(channel);
    });

    this.socket.on(SOCKET_EVENTS.CHANNEL_DELETED, data => {
      this.handleChannelDeleted(data);
    });

    this.socket.on(SOCKET_EVENTS.CHANNEL_UPDATED, channel => {
      this.handleChannelUpdated(channel);
    });

    this.socket.on(SOCKET_EVENTS.CHANNEL_MEMBERS_UPDATED, data => {
      this.handleChannelMembersUpdated(data);
    });

    this.socket.on(SOCKET_EVENTS.CONVERSATION_UPDATED, conversation => {
      this.handleConversationUpdated(conversation);
    });
  }

  setCommunityId(communityId: string) {
    this.communityId = communityId;
    if (this.socket?.connected) {
      this.joinCommunity(communityId);
    }
  }

  joinCommunity(communityId: string) {
    this.emit(SOCKET_EVENTS.JOIN_COMMUNITY, { communityId });
  }

  /** Emit JOIN_CHANNEL once connected (also used from connect handler). */
  private flushJoinChannel(channelId: string) {
    this.joinChannelPendingFlush = channelId;
    this.emit(SOCKET_EVENTS.JOIN_CHANNEL, { channelId });
    if (this.socket?.connected) {
      this.joinChannelPendingFlush = null;
    }
  }

  joinChannel(channelId: string) {
    console.log('Socket: Joining channel', channelId);
    store.set(activeChannelIdAtom, channelId);
    if (this.socket?.connected) {
      this.flushJoinChannel(channelId);
    } else {
      this.joinChannelPendingFlush = channelId;
    }
  }

  leaveChannel(channelId: string) {
    if (this.joinChannelPendingFlush === channelId) {
      this.joinChannelPendingFlush = null;
    }
    store.set(activeChannelIdAtom, null);
    this.emit(SOCKET_EVENTS.LEAVE_CHANNEL, { channelId });
  }

  sendMessage(messageData: any) {
    console.log('Socket: Sending message', messageData);
    this.emit(SOCKET_EVENTS.NEW_MESSAGE, messageData);
  }

  sendTypingStart(channelId: string) {
    this.emit(SOCKET_EVENTS.TYPING_START, { channelId });
  }

  sendTypingStop(channelId: string) {
    this.emit(SOCKET_EVENTS.TYPING_STOP, { channelId });
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      console.log(`Socket: Emitting ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`Socket: Not connected. Cannot emit ${event}`);
    }
  }

  on(event: string, callback: (data: any) => void) {
    console.log(`Socket: Subscribing to ${event}`);
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  disconnect() {
    this.joinChannelPendingFlush = null;
    this.socket?.disconnect();
    this.socket = null;
  }

  // Event Handlers that update Jotai state
  private handleMessageReceived(payload: any) {
    console.log('Socket: Received message payload', payload);

    const message = payload?.message ?? payload?.data ?? payload;
    const channelId = this.resolveChannelId(payload, message);

    if (!channelId) {
      console.warn('Socket: Received message without channelId', payload);
      return;
    }

    const currentMessages = store.get(chatMessagesAtom);
    const channelMessages = currentMessages[channelId] || [];
    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ currentMessages:',
      currentMessages,
    );
    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ channelMessages:',
      channelMessages,
    );

    // Avoid duplicates for permanent messages.
    // IMPORTANT: only dedupe when the incoming message has a real id.
    // If `_id/id` is missing/undefined, the old check could match unrelated messages
    // and cause an early return (blocking real-time UI updates).
    const incomingId = message?._id ?? message?.id;
    if (incomingId) {
      const exists = channelMessages.some(
        (m: any) =>
          !m?.isOptimistic &&
          ((m?._id && m._id === incomingId) || (m?.id && m.id === incomingId)),
      );
      if (exists) {
        console.log(
          'Socket: Duplicate message ignored for channel',
          channelId,
          'id=',
          incomingId,
        );
        return;
      }
    }

    // Replace optimistic message if it exists
    const senderId =
      message.sender?._id || message.sender?.id || message.senderId;
    const optimisticIndex = channelMessages.findIndex(
      (m: any) =>
        m.isOptimistic &&
        !!senderId &&
        (m.sender?._id === senderId ||
          m.sender?.id === senderId ||
          m.senderId === senderId) &&
        m.content === message.content,
    );
    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ senderId:',
      senderId,
    );
    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ optimisticIndex:',
      optimisticIndex,
    );

    let updatedChannelMessages;
    if (optimisticIndex !== -1) {
      updatedChannelMessages = [...channelMessages];
      updatedChannelMessages[optimisticIndex] = message;
    } else {
      updatedChannelMessages = [...channelMessages, message];
    }

    updatedChannelMessages.sort((a: any, b: any) => {
      const ta = new Date(a?.createdAt ?? 0).getTime();
      const tb = new Date(b?.createdAt ?? 0).getTime();
      return tb - ta;
    });

    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ updatedChannelMessages:',
      updatedChannelMessages,
    );
    const updatedMessages = {
      ...currentMessages,
      [channelId]: updatedChannelMessages,
    };
    console.log(
      '🚀 ~ SocketService ~ handleMessageReceived ~ updatedMessages:',
      updatedMessages,
    );

    console.log(
      `Socket: writing chatMessagesAtom channel[${channelId}] -> ${updatedChannelMessages.length}`,
    );
    store.set(chatMessagesAtom, updatedMessages);

    // Debug: confirm store writes are visible immediately
    try {
      const after = store.get(chatMessagesAtom);
      console.log(
        `Socket: stored message in channel[${channelId}] -> ${
          after?.[channelId]?.length ?? 0
        }`,
      );
    } catch {}
  }

  private handleMessageUpdated(payload: any) {
    console.log('Socket: Received message update payload', payload);
    const message = payload?.message ?? payload?.data ?? payload;
    const channelId = this.resolveChannelId(payload, message);

    if (!channelId) return;

    const currentMessages = store.get(chatMessagesAtom);
    const channelMessages = currentMessages[channelId] || [];

    const updatedChannelMessages = channelMessages.map((m: any) =>
      m._id === message._id || m.id === message.id ? message : m,
    );

    store.set(chatMessagesAtom, {
      ...currentMessages,
      [channelId]: updatedChannelMessages,
    });
  }

  private handleMessageDeleted(payload: any) {
    console.log('Socket: Received message deletion payload', payload);
    const data = payload?.data ?? payload;
    const messageId = data.messageId || data._id || data.id;
    const channelId = this.resolveChannelId(payload, data);

    if (!channelId || !messageId) return;

    const currentMessages = store.get(chatMessagesAtom);
    const channelMessages = currentMessages[channelId] || [];

    const updatedChannelMessages = channelMessages.filter(
      (m: any) => m._id !== messageId && m.id !== messageId,
    );

    store.set(chatMessagesAtom, {
      ...currentMessages,
      [channelId]: updatedChannelMessages,
    });
  }

  private handleUserTyping(data: any, isTyping: boolean) {
    const { userId, user } = data;
    const channelId = this.normalizeId(data?.channelId);
    if (!channelId || !userId) return;

    const currentTyping = store.get(typingUsersAtom);
    const channelTyping = currentTyping[channelId] || [];

    let updatedChannelTyping;
    if (isTyping) {
      if (channelTyping.find((u: any) => u.userId === userId)) return;
      updatedChannelTyping = [...channelTyping, { userId, ...user }];
    } else {
      updatedChannelTyping = channelTyping.filter(
        (u: any) => u.userId !== userId,
      );
    }

    store.set(typingUsersAtom, {
      ...currentTyping,
      [channelId]: updatedChannelTyping,
    });
  }

  private handleChannelCreated(channel: any) {
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);

    if (currentChannelsRes?.data) {
      const updatedChannels = [...currentChannelsRes.data, channel];
      store.set(apiGetChatChannelsAtom, {
        ...currentChannelsRes,
        data: updatedChannels,
      });
    }
  }

  private handleChannelDeleted(data: any) {
    const { channelId } = data;
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);

    if (currentChannelsRes?.data) {
      const updatedChannels = currentChannelsRes.data.filter(
        (c: any) => c._id !== channelId && c.id !== channelId,
      );
      store.set(apiGetChatChannelsAtom, {
        ...currentChannelsRes,
        data: updatedChannels,
      });
    }
  }

  private handleChannelUpdated(channel: any) {
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);

    if (currentChannelsRes?.data) {
      const updatedChannels = currentChannelsRes.data.map((c: any) =>
        c._id === channel._id || c.id === channel.id ? channel : c,
      );
      store.set(apiGetChatChannelsAtom, {
        ...currentChannelsRes,
        data: updatedChannels,
      });
    }
  }

  private handleChannelMembersUpdated(data: any) {
    const { channelId, memberCount } = data;
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);

    if (currentChannelsRes?.data) {
      const updatedChannels = currentChannelsRes.data.map((c: any) =>
        c._id === channelId || c.id === channelId ? { ...c, memberCount } : c,
      );
      store.set(apiGetChatChannelsAtom, {
        ...currentChannelsRes,
        data: updatedChannels,
      });
    }
  }

  private handleConversationUpdated(conversation: any) {
    const apiGetChatConversationsAtom = objectAtomFamily(
      AtomKeys.apiGetChatConversations,
    );
    const currentConversationsRes = store.get(apiGetChatConversationsAtom);

    if (currentConversationsRes?.data) {
      const updatedConversations = currentConversationsRes.data.map((c: any) =>
        c._id === conversation._id || c.id === conversation.id
          ? conversation
          : c,
      );
      store.set(apiGetChatConversationsAtom, {
        ...currentConversationsRes,
        data: updatedConversations,
      });
    }
  }
}

export default new SocketService();
