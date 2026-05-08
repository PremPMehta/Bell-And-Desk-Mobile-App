export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_COMMUNITY: 'join_community',
  JOIN_CHANNEL: 'join_channel',
  LEAVE_CHANNEL: 'leave_channel',
  JOIN_CONVERSATION: 'join_conversation',
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
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_UPDATED_CLIENT: 'message_updated',
  MESSAGE_DELETED_CLIENT: 'message_deleted',
  CHANNEL_CREATED: 'channel_created',
  CHANNEL_DELETED: 'channel_deleted',
  CHANNEL_UPDATED: 'channel_updated',
  CONVERSATION_UPDATED: 'conversation_updated',
  CHANNEL_MEMBERS_UPDATED: 'channel_members_updated',
};
