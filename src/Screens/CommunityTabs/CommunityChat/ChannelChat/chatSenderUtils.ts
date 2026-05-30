export type ResolvedChatSender = {
  sender: Record<string, any>;
  displayName: string;
  initials: string;
};

/** Merge message.sender with community members and name/username fallbacks. */
export function resolveMessageSender(
  message: any,
  members: any[] = [],
  normalizeId: (value: any) => string,
): ResolvedChatSender {
  const senderId = normalizeId(
    message?.sender?._id ??
      message?.sender?.id ??
      message?.senderId ??
      (typeof message?.sender === 'string' ? message.sender : ''),
  );

  const senderFromMessage =
    message?.sender && typeof message.sender === 'object' ? message.sender : {};
  const nestedUser =
    senderFromMessage?.user && typeof senderFromMessage.user === 'object'
      ? senderFromMessage.user
      : message?.user && typeof message.user === 'object'
        ? message.user
        : {};

  const member =
    senderId && Array.isArray(members)
      ? members.find((m: any) => {
          const memberId = normalizeId(m?._id ?? m?.id ?? m?.userId);
          return !!memberId && memberId === senderId;
        })
      : undefined;

  const sender = { ...(member || {}), ...nestedUser, ...senderFromMessage };

  const displayName =
    [sender?.firstName, sender?.lastName].filter(Boolean).join(' ').trim() ||
    String(sender?.name || '').trim() ||
    String(sender?.userName || sender?.username || '').trim() ||
    'User';

  const initialsSource =
    sender?.firstName ||
    sender?.name ||
    sender?.userName ||
    sender?.username ||
    displayName;

  const initials =
    initialsSource && String(initialsSource).length > 0
      ? String(initialsSource)[0].toUpperCase()
      : 'U';

  return { sender, displayName, initials };
}
