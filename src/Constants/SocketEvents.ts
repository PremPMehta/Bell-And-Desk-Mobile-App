export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_COMMUNITY: 'join_community',
  JOIN_CHANNEL: 'join_channel',
  LEAVE_CHANNEL: 'leave_channel',
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  NEW_MESSAGE: 'new_message',
  MESSAGE_UPDATED: 'message_updated',
  MESSAGE_DELETED: 'message_deleted',

  /** Some servers broadcast inbound chat on the same event as client emits */
  INBOUND_NEW_MESSAGE_ALIAS: 'new_message',

  // Server -> Client
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  /**
   * Many backends broadcast typing on different names than `user_typing`.
   * All are wired to the same handler in SocketService.
   */
  USER_TYPING_ALIASES: [
    'typing',
    'userTyping',
    'typing_start',
    'typingStarted',
    'channel_user_typing',
  ] as const,
  USER_STOPPED_TYPING_ALIASES: [
    'stop_typing',
    'typing_stop',
    'typingStopped',
    'userStoppedTyping',
    'channel_user_stop_typing',
  ] as const,
  MESSAGE_RECEIVED: 'message_received',
  /**
   * Optional aliases — many backends use a different name than `message_received`.
   * All are wired in SocketService to the same inbound handler as MESSAGE_RECEIVED.
   */
  MESSAGE_RECEIVED_ALIASES: [
    'receive_message',
    'receiveMessage',
    'incoming_message',
    'chat_message',
    'message_received_client',
    'conversation_message',
    'dm_message',
  ] as const,
  MESSAGE_UPDATED_CLIENT: 'message_updated',
  MESSAGE_DELETED_CLIENT: 'message_deleted',
  CHANNEL_CREATED: 'channel_created',
  CHANNEL_DELETED: 'channel_deleted',
  CHANNEL_UPDATED: 'channel_updated',
  CONVERSATION_UPDATED: 'conversation_updated',
  CHANNEL_MEMBERS_UPDATED: 'channel_members_updated',
};
