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
  userAtom,
} from '@/Jotai/Atoms';
import { AtomKeys } from '@/Jotai/AtomKeys';

class SocketService {
  private socket: Socket | null = null;
  private communityId: string | null = null;
  /** When join runs before CONNECT, reconnect handler flushes joining the channel */
  private joinChannelPendingFlush: string | null = null;
  /** Active DM conversation — re-joined on reconnect via join_conversation */
  private activeConversationId: string | null = null;

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
    const msgType = String(message?.type || payload?.type || '').toLowerCase();
    const isDm =
      msgType === 'dm' ||
      msgType === 'direct' ||
      message?.conversationId != null ||
      payload?.conversationId != null;

    if (isDm) {
      const conversationId = this.normalizeId(
        payload?.conversationId ??
          payload?.conversation?._id ??
          payload?.conversation?.id ??
          message?.conversationId ??
          message?.conversation?._id ??
          message?.conversation?.id,
      );
      if (conversationId) return conversationId.trim();
    }

    const fromPayload = this.normalizeId(payload?.channelId);
    if (fromPayload) return fromPayload.trim();
    if (payload?.channel != null) {
      const p = this.normalizeId(payload.channel);
      if (p) return p.trim();
    }
    const fromPayloadConv = this.normalizeId(
      payload?.conversationId ?? payload?.conversation?._id ?? payload?.conversation?.id,
    );
    if (fromPayloadConv) return fromPayloadConv.trim();
    const fromMsg = this.normalizeId(
      message?.channelId ??
        message?.channel_id ??
        message?.conversationId ??
        message?.roomId ??
        (typeof message?.channel === 'string'
          ? message.channel
          : message?.channel),
    );
    if (fromMsg) return fromMsg.trim();
    const nested = message?.channel;
    const nestedId = this.normalizeId(nested?._id ?? nested?.id ?? nested);
    return nestedId ? nestedId.trim() : undefined;
  }

  /** GET /chat/channels response may use `data` or `channels` — socket patches must match. */
  private getChannelListPack(prev: any): { rows: any[]; key: 'data' | 'channels' } | null {
    if (!prev || typeof prev !== 'object') return null;
    if (Array.isArray(prev.data)) return { rows: prev.data, key: 'data' };
    if (Array.isArray(prev.channels)) return { rows: prev.channels, key: 'channels' };
    return null;
  }

  private getConversationListPack(prev: any): {
    rows: any[];
    key: 'data' | 'conversations';
  } | null {
    if (!prev || typeof prev !== 'object') return null;
    if (Array.isArray(prev.data)) return { rows: prev.data, key: 'data' };
    if (Array.isArray(prev.conversations)) {
      return { rows: prev.conversations, key: 'conversations' };
    }
    return null;
  }

  /**
   * Single entry for server → client chat payloads (same as legacy name `handleReceive`
   * in many backends). Log here in __DEV__ — the handler implementation is
   * `handleMessageReceived` below.
   */
  private onInboundChatPayload = (payload: any) => {
    if (__DEV__) {
      console.log('[SocketService] onInboundChatPayload (chat receive)', payload);
    }
    this.handleMessageReceived(payload);
  };

  /** __DEV__ only: log likely chat-related socket.io events so you can match server names. */
  private boundOnAnyChatRelatedDebug = (eventName: string, ...args: any[]) => {
    if (!__DEV__) return;
    if (/^(connect|disconnect|ping|pong)$/i.test(eventName)) return;
    if (
      /message|chat|channel|conversation|receive|incoming|reply|send|typing/i.test(
        eventName,
      )
    ) {
      console.log('[SocketService] socket.io event:', eventName, args?.[0]);
    }
  };

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
        message.conversationId ||
        message.roomId ||
        message.content != null ||
        message.text != null ||
        message.type === 'channel' ||
        message.type === 'dm' ||
        message.type === 'direct');
    if (looksLikeChat) {
      this.onInboundChatPayload(payload);
    } else if (__DEV__) {
      console.log(
        '[SocketService] new_message ignored (does not look like chat payload)',
        message,
      );
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
      if (this.activeConversationId) {
        this.emit(SOCKET_EVENTS.JOIN_CONVERSATION, {
          conversationId: this.activeConversationId,
        });
      }
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
    for (const ev of SOCKET_EVENTS.MESSAGE_RECEIVED_ALIASES) {
      this.socket.removeAllListeners(ev);
    }
    this.socket.removeAllListeners(SOCKET_EVENTS.MESSAGE_UPDATED_CLIENT);
    this.socket.removeAllListeners(SOCKET_EVENTS.MESSAGE_DELETED_CLIENT);
    this.socket.removeAllListeners(SOCKET_EVENTS.USER_TYPING);
    this.socket.removeAllListeners(SOCKET_EVENTS.USER_STOPPED_TYPING);
    for (const ev of SOCKET_EVENTS.USER_TYPING_ALIASES) {
      this.socket.removeAllListeners(ev);
    }
    for (const ev of SOCKET_EVENTS.USER_STOPPED_TYPING_ALIASES) {
      this.socket.removeAllListeners(ev);
    }
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_CREATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_DELETED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_UPDATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CHANNEL_MEMBERS_UPDATED);
    this.socket.removeAllListeners(SOCKET_EVENTS.CONVERSATION_UPDATED);

    this.setupGlobalListeners();
    this.wireInboundChatRelay();

    if (__DEV__ && this.socket) {
      this.socket.offAny(this.boundOnAnyChatRelatedDebug);
      this.socket.onAny(this.boundOnAnyChatRelatedDebug);
    }
  }

  private setupGlobalListeners() {
    if (!this.socket) return;

    // Server -> Client Listeners (chat inbound + common backend aliases)
    this.socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, this.onInboundChatPayload);
    for (const ev of SOCKET_EVENTS.MESSAGE_RECEIVED_ALIASES) {
      this.socket.on(ev, this.onInboundChatPayload);
    }

    this.socket.on(SOCKET_EVENTS.MESSAGE_UPDATED_CLIENT, message => {
      this.handleMessageUpdated(message);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_DELETED_CLIENT, data => {
      this.handleMessageDeleted(data);
    });

    this.socket.on(SOCKET_EVENTS.USER_TYPING, this.boundUserTypingInbound);
    this.socket.on(
      SOCKET_EVENTS.USER_STOPPED_TYPING,
      this.boundUserStoppedInbound,
    );

    for (const ev of SOCKET_EVENTS.USER_TYPING_ALIASES) {
      if (ev === 'typing') {
        this.socket.on(ev, this.boundFlexibleTypingInbound);
      } else {
        this.socket.on(ev, this.boundUserTypingInbound);
      }
    }
    for (const ev of SOCKET_EVENTS.USER_STOPPED_TYPING_ALIASES) {
      this.socket.on(ev, this.boundUserStoppedInbound);
    }

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
    this.activeConversationId = null;
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

  /** DM screens: join conversation room + channel room (backend may use either). */
  joinConversation(conversationId: string) {
    console.log('Socket: Joining conversation', conversationId);
    this.activeConversationId = conversationId;
    store.set(activeChannelIdAtom, conversationId);
    this.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });
    if (this.socket?.connected) {
      this.flushJoinChannel(conversationId);
    } else {
      this.joinChannelPendingFlush = conversationId;
    }
  }

  leaveConversation(conversationId: string) {
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = null;
    }
    if (this.joinChannelPendingFlush === conversationId) {
      this.joinChannelPendingFlush = null;
    }
    store.set(activeChannelIdAtom, null);
    this.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
    this.emit(SOCKET_EVENTS.LEAVE_CHANNEL, { channelId: conversationId });
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
    this.activeConversationId = null;
    this.socket?.disconnect();
    this.socket = null;
  }

  // Event Handlers that update Jotai state
  private handleMessageReceived(payload: any) {
    const message = payload?.message ?? payload?.data ?? payload;
    let channelId = this.resolveChannelId(payload, message);

    if (!channelId) {
      channelId =
        this.normalizeId(store.get(activeChannelIdAtom)) ||
        this.activeConversationId ||
        undefined;
    }

    if (!channelId) {
      console.warn('Socket: Received message without channelId', payload);
      return;
    }

    const currentMessages = store.get(chatMessagesAtom);
    const channelMessages = currentMessages[channelId] || [];

    // Avoid duplicate rows in the per-channel transcript only.
    // Do NOT return early: channel / DM list atoms (unread, lastMessage) must still
    // update so CommunityChat reflects new activity while the user is on that screen.
    const incomingId = message?._id ?? message?.id;
    const isDuplicateInChat =
      !!incomingId &&
      channelMessages.some(
        (m: any) =>
          !m?.isOptimistic &&
          ((m?._id != null &&
            String(m._id) === String(incomingId)) ||
            (m?.id != null && String(m.id) === String(incomingId))),
      );
    if (isDuplicateInChat) {
      console.log(
        'Socket: Duplicate message skipped for transcript only',
        channelId,
        'id=',
        incomingId,
      );
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
    if (!isDuplicateInChat) {
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

      const updatedMessages = {
        ...currentMessages,
        [channelId]: updatedChannelMessages,
      };

      console.log(
        `Socket: writing chatMessagesAtom channel[${channelId}] -> ${updatedChannelMessages.length}`,
      );
      store.set(chatMessagesAtom, updatedMessages);
    }

    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );

    const targetId = this.normalizeId(channelId);

    store.set(apiGetChatChannelsAtom, (prev: any) => {
      const pack = this.getChannelListPack(prev);
      if (!pack) return prev;
      const updatedChannels = pack.rows.map((c: any) => {
        const cIds = [
          c._id,
          c.id,
          c.channelId,
          c.conversationId,
          c.conversation?._id,
          c.conversation?.id,
          c.channel?._id,
          c.channel?.id,
        ].map(id => this.normalizeId(id));

        if (cIds.includes(targetId)) {
          return {
            ...c,
            lastMessage: message,
            lastMessageAt: message.createdAt ?? c.lastMessageAt,
            unreadCount: this.computeRowUnreadAfterSocketPatch({
              row: c,
              patch: {
                lastMessage: message,
                lastMessageAt: message.createdAt ?? c.lastMessageAt,
              },
              targetId,
            }),
          };
        }
        return c;
      });
      return {
        ...prev,
        [pack.key]: updatedChannels,
        lastSocketUpdate: Date.now(),
      };
    });

    const apiGetChatConversationsAtom = objectAtomFamily(
      AtomKeys.apiGetChatConversations,
    );

    store.set(apiGetChatConversationsAtom, (prev: any) => {
      const convPack = this.getConversationListPack(prev);
      if (!convPack) return prev;
      const updatedConversations = convPack.rows.map((c: any) => {
        const cIds = [
          c._id,
          c.id,
          c.channelId,
          c.channel?._id,
          c.channel?.id,
          c.conversationId,
          c.conversation?._id,
          c.conversation?.id,
        ].map(id => this.normalizeId(id));

        if (cIds.includes(targetId)) {
          return {
            ...c,
            lastMessage: message,
            lastMessageAt: message.createdAt ?? c.lastMessageAt,
            unreadCount: this.computeRowUnreadAfterSocketPatch({
              row: c,
              patch: {
                lastMessage: message,
                lastMessageAt: message.createdAt ?? c.lastMessageAt,
              },
              targetId,
            }),
          };
        }
        return c;
      });
      return {
        ...prev,
        [convPack.key]: updatedConversations,
        lastSocketUpdate: Date.now(),
      };
    });
  }

  private handleMessageUpdated(payload: any) {
    console.log('Socket: Received message update payload', payload);
    const message = payload?.message ?? payload?.data ?? payload;
    const channelId = this.resolveChannelId(payload, message);

    if (!channelId) return;

    const currentMessages = store.get(chatMessagesAtom);
    const channelMessages = currentMessages[channelId] || [];

    const updatedMessageId = this.normalizeId(message?._id ?? message?.id);
    if (!updatedMessageId) {
      console.warn(
        'Socket: message_updated ignored (missing message id)',
        message,
      );
      return;
    }

    const updatedChannelMessages = channelMessages.map((m: any) => {
      const mid = this.normalizeId(m?._id ?? m?.id);
      if (!mid || mid !== updatedMessageId) return m;

      // Never blindly replace the whole object; socket payloads for reactions
      // often include only partial fields. Merge to preserve existing content.
      const merged = { ...m, ...message };
      if (message?.reactions !== undefined) merged.reactions = message.reactions;
      return merged;
    });

    store.set(chatMessagesAtom, {
      ...currentMessages,
      [channelId]: updatedChannelMessages,
    });
  }

  private boundUserTypingInbound = (payload: any) => {
    this.handleUserTyping(payload, true);
  };

  private boundUserStoppedInbound = (payload: any) => {
    this.handleUserTyping(payload, false);
  };

  /**
   * Some servers use one event name `typing` with `{ typing: true|false }`.
   */
  private boundFlexibleTypingInbound = (payload: any) => {
    const data = payload?.data ?? payload?.payload ?? payload;
    const stop =
      data?.typing === false ||
      data?.isTyping === false ||
      data?.stopped === true ||
      data?.action === 'stop';
    this.handleUserTyping(payload, !stop);
  };

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

  private handleUserTyping(payload: any, isTyping: boolean) {
    const data =
      payload?.data ??
      payload?.payload ??
      (payload?.user || payload?.channel ? payload : null) ??
      payload;

    // Backend often omits channelId on typing payloads and only sends { userId, user }.
    // While the user is inside a channel screen we already set `activeChannelIdAtom` on join.
    let channelId =
      this.resolveChannelId(data, data)?.trim() ||
      this.normalizeId(store.get(activeChannelIdAtom))?.trim();

    const rawUser =
      data?.user && typeof data.user === 'object'
        ? data.user
        : data?.sender && typeof data.sender === 'object'
          ? data.sender
          : {};

    const userId = this.normalizeId(
      data?.userId ??
        data?.senderId ??
        data?.memberId ??
        data?.user_id ??
        rawUser?._id ??
        rawUser?.id,
    );

    if (!channelId || !userId) {
      if (__DEV__) {
        console.warn('[SocketService] handleUserTyping ignored (missing IDs)', {
          channelId,
          userId,
          payload,
        });
      }
      return;
    }

    const currentTyping = store.get(typingUsersAtom);
    const channelTyping = currentTyping[channelId] || [];

    let updatedChannelTyping;
    if (isTyping) {
      const exists = channelTyping.some(
        (u: any) => this.normalizeId(u.userId || u._id || u.id) === userId,
      );
      if (exists) return;

      const mergeUser =
        data?.user && typeof data.user === 'object'
          ? { ...data.user, userId }
          : Object.keys(rawUser).length > 0
            ? { ...rawUser, userId }
            : { userId };

      updatedChannelTyping = [...channelTyping, mergeUser];
    } else {
      updatedChannelTyping = channelTyping.filter(
        (u: any) => this.normalizeId(u.userId || u._id || u.id) !== userId,
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
    const pack = this.getChannelListPack(currentChannelsRes);
    if (!pack) return;
    const updatedChannels = [...pack.rows, channel];
    store.set(apiGetChatChannelsAtom, {
      ...currentChannelsRes,
      [pack.key]: updatedChannels,
    });
  }

  /**
   * List APIs / `channel_updated` often omit unreadCount. When lastMessage advances,
   * bump locally using the same rules as handleMessageReceived.
   */
  private computeRowUnreadAfterSocketPatch(opts: {
    row: any;
    patch: any;
    targetId?: string;
  }): number {
    const { row, patch, targetId } = opts;
    const mergedPreview = { ...row, ...patch };
    const msg = mergedPreview.lastMessage;
    const newMid = this.normalizeId(msg?._id ?? msg?.id);
    const cMid = this.normalizeId(row.lastMessage?._id ?? row.lastMessage?.id);

    const alreadyAppliedToRow =
      !!newMid && !!cMid && newMid === cMid;

    const myUser: any = store.get(userAtom);
    const myId = this.normalizeId(myUser?._id || myUser?.id);
    const senderId = this.normalizeId(
      msg?.sender?._id || msg?.sender?.id || msg?.senderId,
    );
    const isFromMe = !!myId && !!senderId && myId === senderId;

    const activeChannelId = this.normalizeId(store.get(activeChannelIdAtom));
    const viewingThisChannel =
      !!targetId && !!activeChannelId && targetId === activeChannelId;

    const hasNewMessage = !!newMid && (!cMid || newMid !== cMid);
    const shouldIncrementUnread =
      hasNewMessage &&
      !viewingThisChannel &&
      !isFromMe &&
      !alreadyAppliedToRow;

    const currentCount = Number(row.unreadCount || 0);
    const patchUnread =
      patch.unreadCount != null ? Number(patch.unreadCount) : null;

    if (patchUnread != null && !Number.isNaN(patchUnread)) {
      if (shouldIncrementUnread) {
        return Math.max(currentCount + 1, patchUnread);
      }
      return Math.max(currentCount, patchUnread);
    }
    return shouldIncrementUnread ? currentCount + 1 : currentCount;
  }

  private handleChannelDeleted(data: any) {
    const { channelId } = data;
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);
    const pack = this.getChannelListPack(currentChannelsRes);
    if (!pack) return;
    const updatedChannels = pack.rows.filter(
      (c: any) => c._id !== channelId && c.id !== channelId,
    );
    store.set(apiGetChatChannelsAtom, {
      ...currentChannelsRes,
      [pack.key]: updatedChannels,
    });
  }

  private handleChannelUpdated(raw: any) {
    const channel = raw?.channel ?? raw?.data?.channel ?? raw?.data ?? raw;
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);
    const pack = this.getChannelListPack(currentChannelsRes);
    if (!pack) return;
    const targetId = this.normalizeId(
      channel._id || channel.id || channel.channelId,
    );
    if (!targetId) return;
    const updatedChannels = pack.rows.map((c: any) => {
      const cIds = [
        c._id,
        c.id,
        c.channelId,
        c.channel?._id,
        c.channel?.id,
      ].map(id => this.normalizeId(id));
      if (!cIds.includes(targetId)) return c;
      const merged = { ...c, ...channel };
      merged.unreadCount = this.computeRowUnreadAfterSocketPatch({
        row: c,
        patch: channel,
        targetId,
      });
      return merged;
    });
    store.set(apiGetChatChannelsAtom, {
      ...currentChannelsRes,
      [pack.key]: updatedChannels,
      lastSocketUpdate: Date.now(),
    });
  }

  private handleChannelMembersUpdated(data: any) {
    const { channelId, memberCount } = data;
    const apiGetChatChannelsAtom = objectAtomFamily(
      AtomKeys.apiGetChatChannels,
    );
    const currentChannelsRes = store.get(apiGetChatChannelsAtom);
    const pack = this.getChannelListPack(currentChannelsRes);
    if (!pack) return;
    const updatedChannels = pack.rows.map((c: any) => {
      const targetId = this.normalizeId(channelId);
      const cIds = [c._id, c.id, c.channelId].map(id => this.normalizeId(id));
      return cIds.includes(targetId) ? { ...c, memberCount } : c;
    });
    store.set(apiGetChatChannelsAtom, {
      ...currentChannelsRes,
      [pack.key]: updatedChannels,
      lastSocketUpdate: Date.now(),
    });
  }

  private handleConversationUpdated(raw: any) {
    const conversation =
      raw?.conversation ?? raw?.data?.conversation ?? raw?.data ?? raw;
    const apiGetChatConversationsAtom = objectAtomFamily(
      AtomKeys.apiGetChatConversations,
    );
    const currentConversationsRes = store.get(apiGetChatConversationsAtom);
    const pack = this.getConversationListPack(currentConversationsRes);
    if (!pack) return;
    const updatedConversations = pack.rows.map((c: any) => {
      const targetId = this.normalizeId(
        conversation._id ||
          conversation.id ||
          conversation.conversationId ||
          conversation.channelId,
      );
      if (!targetId) return c;
      const cIds = [
        c._id,
        c.id,
        c.channelId,
        c.conversationId,
        c.channel?._id,
        c.channel?.id,
        c.conversation?._id,
        c.conversation?.id,
      ].map(id => this.normalizeId(id));
      if (!cIds.includes(targetId)) return c;
      const merged = { ...c, ...conversation };
      merged.unreadCount = this.computeRowUnreadAfterSocketPatch({
        row: c,
        patch: conversation,
        targetId,
      });
      return merged;
    });
    store.set(apiGetChatConversationsAtom, {
      ...currentConversationsRes,
      [pack.key]: updatedConversations,
      lastSocketUpdate: Date.now(),
    });
  }
}

export default new SocketService();
