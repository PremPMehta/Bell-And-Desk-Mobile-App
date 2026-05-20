import { Linking, Platform } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import ToastModule from '@/Components/Core/Toast';
import { mediaPreviewAtom } from '@/Jotai/Atoms';
import { store } from '@/Jotai/Store';
import type { ChatAttachmentPickPayload } from './AttachmentOptionsModal';
import { keepLocalCopy } from '@react-native-documents/picker';
import { ApiEndPoints } from '@/ApiService/api-end-points';
import { Config } from '@/Config';
import useStorage from '@/Hooks/Utils/use-storage';
import { AtomKeys } from '@/Jotai/AtomKeys';

export type ChatAttachmentKind = 'image' | 'video' | 'audio' | 'file';

export type FileTypeMeta = {
  icon: string;
  label: string;
  accent: string;
};

const OFFICE_MIME_PREFIXES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'text/plain',
  'text/csv',
];

const IN_APP_FILE_PATTERN = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|rtf)$/i;

const AUDIO_EXT_MIME: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.webm': 'audio/webm',
  '.flac': 'audio/flac',
};

export type ChatMessageAttachmentPayload = {
  filename: string;
  mimetype: string;
  originalName: string;
  size: number;
  url: string;
};

export type PendingChatAttachment = {
  uri: string;
  fileName: string;
  mimeType: string;
  isImage: boolean;
  isAudio: boolean;
  size?: number;
  /** Set after audio is uploaded on pick (chat/upload). */
  uploadedAttachments?: ChatMessageAttachmentPayload[];
};

const getChatUploadUrl = (): string => {
  const base = String(Config.API_URL || '').endsWith('/')
    ? String(Config.API_URL)
    : `${Config.API_URL}/`;
  return `${base}${ApiEndPoints.chatUpload}`;
};

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await useStorage.getItem(AtomKeys.authToken);
  } catch {
    return null;
  }
};

export const resolveChatUploadMimeType = (
  fileName: string,
  reportedType?: string | null,
  fallback = 'application/octet-stream',
): string => {
  const type = String(reportedType || '')
    .trim()
    .toLowerCase();

  const ext = fileName.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];

  // Prefer extension-derived audio MIME types. This avoids server rejections for
  // alias types like `audio/x-wav` (backend expects `audio/wav`).
  if (ext && AUDIO_EXT_MIME[ext]) {
    if (!type) return AUDIO_EXT_MIME[ext];
    if (type === 'application/octet-stream') return AUDIO_EXT_MIME[ext];
    if (type.startsWith('audio/')) return AUDIO_EXT_MIME[ext];
  }

  if (type.includes('/')) {
    // Normalize common audio aliases to canonical MIME types.
    if (type === 'audio/x-wav' || type === 'audio/wave') return 'audio/wav';
    if (type === 'audio/x-m4a') return 'audio/mp4';
    return type;
  }

  return fallback;
};

const ensureFileExtension = (fileName: string, mimeType: string): string => {
  if (/\.[a-z0-9]+$/i.test(fileName)) return fileName;

  const extByMime: Record<string, string> = {
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/mp4': '.m4a',
    'audio/aac': '.aac',
    'audio/ogg': '.ogg',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'video/mp4': '.mp4',
  };

  const ext = extByMime[mimeType.toLowerCase()] || '';
  return ext ? `${fileName}${ext}` : fileName;
};

export const createPendingAttachmentFromPick = (
  payload: ChatAttachmentPickPayload,
): PendingChatAttachment | null => {
  if (payload.kind === 'gallery' || payload.kind === 'camera') {
    const asset = payload.assets?.[0];
    if (!asset?.uri) return null;

    const mimeType = asset.type || 'image/jpeg';
    const isImage =
      mimeType.startsWith('image/') ||
      (!mimeType.startsWith('video/') && !mimeType.startsWith('audio/'));

    return {
      uri: asset.uri,
      fileName: ensureFileExtension(
        asset.fileName || `chat-${Date.now()}.jpg`,
        mimeType,
      ),
      mimeType,
      isImage,
      isAudio: mimeType.startsWith('audio/'),
      size: asset.fileSize,
    };
  }

  if (payload.kind === 'document' || payload.kind === 'audio') {
    const file = payload.file;
    if (!file?.uri) return null;

    const fallbackMime =
      payload.kind === 'audio' ? 'audio/mpeg' : 'application/octet-stream';
    const mimeType = resolveChatUploadMimeType(
      file.name || 'file',
      file.type,
      fallbackMime,
    );

    return {
      uri: file.uri,
      fileName: ensureFileExtension(file.name || 'file', mimeType),
      mimeType,
      isImage: false,
      isAudio: payload.kind === 'audio' || mimeType.startsWith('audio/'),
      size: file.size ?? undefined,
    };
  }

  return null;
};

export const buildOptimisticAttachments = (pending: PendingChatAttachment) => {
  if (pending.uploadedAttachments?.length) {
    return pending.uploadedAttachments.map(att => ({
      url: att.url,
      mimetype: att.mimetype,
      originalName: att.originalName,
      filename: att.filename,
      size: att.size,
    }));
  }

  return [
    {
      url: pending.uri,
      mimetype: pending.mimeType,
      originalName: pending.fileName,
      filename: pending.fileName,
      ...(pending.size != null ? { size: pending.size } : {}),
    },
  ];
};

const isAppCachedFileUri = (uri: string): boolean =>
  /\/Library\/Caches\//i.test(uri) ||
  /\/Library\/Application Support\//i.test(uri) ||
  /\/Documents\//i.test(uri) ||
  uri.includes('chat_upload_');

const shouldStagePickerUri = (uri: string): boolean => {
  if (isAppCachedFileUri(uri)) return false;
  if (uri.startsWith('content://')) return true;
  if (Platform.OS === 'ios' && !uri.startsWith('http')) return true;
  return false;
};

const stagePickerUriIfNeeded = async (
  uri: string,
  fileName: string,
): Promise<string> => {
  if (!shouldStagePickerUri(uri)) {
    return uri;
  }

  const [copyResult] = await keepLocalCopy({
    files: [{ uri, fileName }],
    destination: 'cachesDirectory',
  });

  if (copyResult.status === 'success' && copyResult.localUri) {
    return copyResult.localUri;
  }

  const copyError =
    copyResult.status === 'error' ? copyResult.copyError : 'Unknown error';
  throw new Error(copyError || 'Could not access selected file');
};

const safeDecodeUri = (uri: string): string => {
  if (!uri.includes('%')) return uri;
  try {
    return decodeURIComponent(uri);
  } catch {
    return uri;
  }
};

const toFilesystemPath = (uri: string): string =>
  safeDecodeUri(uri).replace(/^file:\/\//, '');

/**
 * iOS: copy to a stable cache path and verify size before multipart upload.
 * RN FormData on iOS expects a plain filesystem path (no file://), same as Profile upload.
 */
const ensureIosUploadableFilePath = async (
  sourceUri: string,
  fileName: string,
): Promise<string> => {
  let uri = sourceUri;
  if (shouldStagePickerUri(uri)) {
    uri = await stagePickerUriIfNeeded(uri, fileName);
  }

  let path = toFilesystemPath(uri);
  let exists = await ReactNativeBlobUtil.fs.exists(path);

  if (!exists) {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const destPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/chat_upload_${Date.now()}_${safeName}`;
    const srcPath = toFilesystemPath(uri);
    await ReactNativeBlobUtil.fs.cp(srcPath, destPath);
    path = destPath;
  }

  if (!(await ReactNativeBlobUtil.fs.exists(path))) {
    throw new Error('Could not access selected file for upload');
  }

  const stat = await ReactNativeBlobUtil.fs.stat(path);
  const size = Number(stat?.size ?? 0);
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error('Selected file is empty or unreadable');
  }

  return path;
};

/** Platform-specific URI shape for RN multipart uploads. */
const toMultipartFileUri = (
  uri: string,
  opts?: { keepFileProtocol?: boolean },
): string => {
  const decoded = safeDecodeUri(uri);

  if (opts?.keepFileProtocol) {
    return decoded.startsWith('file://') ? decoded : `file://${decoded}`;
  }

  if (Platform.OS === 'ios') {
    return decoded.startsWith('file://')
      ? decoded.replace(/^file:\/\//, '')
      : decoded;
  }

  if (
    decoded.startsWith('file://') ||
    decoded.startsWith('content://')
  ) {
    return decoded;
  }

  return `file://${decoded}`;
};

export const resolveChatFileForUpload = async (
  pending: PendingChatAttachment,
): Promise<{ fileName: string; mimeType: string; uri: string }> => {
  const mimeType = resolveChatUploadMimeType(
    pending.fileName,
    pending.mimeType,
    pending.mimeType,
  );
  const fileName = ensureFileExtension(pending.fileName, mimeType);
  const stagedUri = await stagePickerUriIfNeeded(pending.uri, fileName);

  return { fileName, mimeType, uri: stagedUri };
};

const buildChatUploadFormData = (
  fileName: string,
  mimeType: string,
  fileUri: string,
  opts?: { keepFileProtocol?: boolean },
): FormData => {
  const formData = new FormData();

  formData.append('files', {
    uri: toMultipartFileUri(fileUri, opts),
    name: fileName,
    type: mimeType,
  } as any);

  return formData;
};

const parseUploadResponse = (body: any): any => {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      throw new Error('Upload response was invalid');
    }
  }
  return body;
};

const postChatUploadFormData = async (formData: FormData): Promise<any> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getChatUploadUrl(), {
    method: 'POST',
    headers,
    body: formData,
  });

  const body = parseUploadResponse(await response.text());

  if (!response.ok) {
    const message =
      body?.message || body?.error || 'Could not upload attachment';
    throw new Error(message);
  }

  return body;
};

const uploadChatFileViaFetch = async (
  fileName: string,
  mimeType: string,
  fileUri: string,
  opts?: { keepFileProtocol?: boolean },
): Promise<any> => {
  const formData = buildChatUploadFormData(
    fileName,
    mimeType,
    fileUri,
    opts,
  );
  return postChatUploadFormData(formData);
};

/** Reliable multipart upload on iOS (axios FormData can hang indefinitely). */
const uploadChatFileViaBlobUtil = async (
  filesystemPath: string,
  fileName: string,
  mimeType: string,
): Promise<any> => {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await ReactNativeBlobUtil.fetch(
    'POST',
    getChatUploadUrl(),
    headers,
    [
      {
        name: 'files',
        filename: fileName,
        type: mimeType,
        data: ReactNativeBlobUtil.wrap(filesystemPath),
      },
    ],
  );

  const status = response.info().status;
  const body = parseUploadResponse(await response.text());

  if (status < 200 || status >= 300) {
    const message =
      body?.message || body?.error || 'Could not upload attachment';
    throw new Error(message);
  }

  return body;
};

const uploadChatFileOnIos = async (
  pending: PendingChatAttachment,
): Promise<any> => {
  const mimeType = resolveChatUploadMimeType(
    pending.fileName,
    pending.mimeType,
    pending.mimeType,
  );
  const fileName = ensureFileExtension(pending.fileName, mimeType);
  const filesystemPath = await ensureIosUploadableFilePath(
    pending.uri,
    fileName,
  );
  const fileUri = `file://${filesystemPath}`;

  const attempts: Array<() => Promise<any>> = [
    () => uploadChatFileViaBlobUtil(filesystemPath, fileName, mimeType),
    () =>
      uploadChatFileViaFetch(fileName, mimeType, fileUri, {
        keepFileProtocol: true,
      }),
    () => uploadChatFileViaFetch(fileName, mimeType, filesystemPath),
  ];

  let lastError: Error | null = null;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (err: any) {
      lastError =
        err instanceof Error
          ? err
          : new Error(String(err?.message || 'Could not upload attachment'));
    }
  }

  throw lastError || new Error('Could not upload attachment');
};

/**
 * POST chat/upload with `files` field (same as web).
 * Android: fetch multipart. iOS: verified cache file + blob-util / fetch (not axios).
 */
const uploadChatFileToServer = async (
  pending: PendingChatAttachment,
): Promise<any> => {
  if (Platform.OS === 'ios') {
    return uploadChatFileOnIos(pending);
  }

  const { fileName, mimeType, uri } = await resolveChatFileForUpload(pending);
  return uploadChatFileViaFetch(fileName, mimeType, uri);
};

export const getMessageAttachments = (message: any): any[] => {
  const raw = message?.attachments;
  return Array.isArray(raw) ? raw.filter(Boolean) : [];
};

export const getAttachmentKind = (attachment: any): ChatAttachmentKind => {
  const mime = String(
    attachment?.mimetype || attachment?.mimeType || '',
  ).toLowerCase();

  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';

  const name = String(
    attachment?.originalName || attachment?.filename || '',
  ).toLowerCase();

  if (/\.(jpe?g|png|gif|webp|bmp|heic)$/.test(name)) return 'image';
  if (/\.(mp4|mov|webm|mkv|avi)$/.test(name)) return 'video';
  if (/\.(mp3|wav|m4a|aac|ogg)$/.test(name)) return 'audio';

  return 'file';
};

export const resolveAttachmentUrl = (attachment: any): string | null => {
  const url = attachment?.url || attachment?.uri || attachment?.path;
  if (!url) return null;
  return getFullImageUrl(String(url));
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getAttachmentDisplayName = (attachment: any): string =>
  attachment?.originalName || attachment?.filename || 'Attachment';

const getAttachmentMime = (attachment: any): string =>
  String(attachment?.mimetype || attachment?.mimeType || '').toLowerCase();

export const getFileTypeMeta = (
  attachment: any,
  kind: ChatAttachmentKind,
): FileTypeMeta => {
  if (kind === 'audio') {
    return {
      icon: 'Headphones',
      label: 'Audio',
      accent: 'rgba(155, 89, 182, 0.35)',
    };
  }

  const name = getAttachmentDisplayName(attachment).toLowerCase();
  const mime = getAttachmentMime(attachment);

  if (mime.includes('pdf') || name.endsWith('.pdf')) {
    return {
      icon: 'FileText',
      label: 'PDF',
      accent: 'rgba(231, 76, 60, 0.35)',
    };
  }

  if (mime.includes('word') || /\.docx?$/.test(name)) {
    return {
      icon: 'FileText',
      label: 'Document',
      accent: 'rgba(52, 152, 219, 0.35)',
    };
  }

  if (
    mime.includes('sheet') ||
    mime.includes('excel') ||
    /\.xlsx?$/.test(name)
  ) {
    return {
      icon: 'FileText',
      label: 'Spreadsheet',
      accent: 'rgba(46, 204, 113, 0.35)',
    };
  }

  if (
    mime.includes('presentation') ||
    mime.includes('powerpoint') ||
    /\.pptx?$/.test(name)
  ) {
    return {
      icon: 'FileText',
      label: 'Presentation',
      accent: 'rgba(230, 126, 34, 0.35)',
    };
  }

  if (mime.startsWith('text/') || /\.(txt|csv|rtf)$/.test(name)) {
    return {
      icon: 'FileText',
      label: 'Text',
      accent: 'rgba(149, 165, 166, 0.35)',
    };
  }

  return {
    icon: 'File',
    label: 'File',
    accent: 'rgba(255, 255, 255, 0.12)',
  };
};

export const canPreviewInApp = (
  attachment: any,
  kind: ChatAttachmentKind,
): boolean => {
  if (kind === 'audio') return true;

  const mime = getAttachmentMime(attachment);
  const name = getAttachmentDisplayName(attachment).toLowerCase();

  if (mime.includes('pdf') || IN_APP_FILE_PATTERN.test(name)) {
    return true;
  }

  return OFFICE_MIME_PREFIXES.some(prefix => mime.startsWith(prefix));
};

export const openChatAttachment = (
  navigation: NavigationProp<Record<string, object | undefined>>,
  attachment: any,
) => {
  const url = resolveAttachmentUrl(attachment);
  if (!url) {
    ToastModule.errorBottom({ msg: 'File link is unavailable' });
    return;
  }

  const kind = getAttachmentKind(attachment);
  const title = getAttachmentDisplayName(attachment);
  const mimeType = getAttachmentMime(attachment) || undefined;

  if (kind === 'audio') {
    store.set(mediaPreviewAtom, {
      visible: true,
      uri: url,
      type: 'audio',
      title,
    });
    return;
  }

  if (canPreviewInApp(attachment, kind)) {
    navigation.navigate('PdfViewer', {
      pdfUrl: url,
      title,
      mimeType,
    });
    return;
  }

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
      ToastModule.errorBottom({ msg: 'Cannot open this file type' });
    })
    .catch(() => {
      ToastModule.errorBottom({ msg: 'Could not open file' });
    });
};

const uploadItemsFromResponse = (uploadRes: any): any[] => {
  if (!uploadRes || typeof uploadRes !== 'object') return [];

  const data = uploadRes.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.filename || data.url || data.path) return [data];
  }
  if (Array.isArray(uploadRes?.data?.data)) return uploadRes.data.data;
  if (Array.isArray(uploadRes?.files)) return uploadRes.files;
  if (Array.isArray(uploadRes?.result)) return uploadRes.result;
  if (Array.isArray(uploadRes)) return uploadRes;

  return [];
};

export const normalizeUploadedAttachments = (
  uploadRes: any,
): ChatMessageAttachmentPayload[] => {
  const items = uploadItemsFromResponse(uploadRes);

  return items
    .map((item: any) => {
      const rawUrl = item?.url ?? item?.path ?? '';
      const url =
        typeof rawUrl === 'string' ? rawUrl.trim() : String(rawUrl || '');
      const filename = String(item?.filename || item?.fileName || '').trim();
      let mimetype = String(item?.mimetype || item?.mimeType || '').trim();
      if (!mimetype && filename) {
        mimetype = resolveChatUploadMimeType(
          filename,
          null,
          'application/octet-stream',
        );
      }
      const originalName = String(
        item?.originalName || item?.name || filename,
      ).trim();
      const size =
        typeof item?.size === 'number' && Number.isFinite(item.size)
          ? item.size
          : parseInt(String(item?.size ?? '0'), 10) || 0;

      return {
        filename,
        mimetype,
        originalName,
        size,
        url,
      };
    })
    .filter(item => item.filename && item.url);
};

/**
 * Normalize to the exact attachment shape the chat message API expects (same as web).
 */
export const formatAttachmentsForChatMessage = (
  items: ChatMessageAttachmentPayload[],
): ChatMessageAttachmentPayload[] => {
  return items.map(att => {
    const filename = String(att.filename || '').trim();
    const url = String(att.url || '').trim();
    let mimetype = String(att.mimetype || '').trim();
    if (!mimetype && filename) {
      mimetype = resolveChatUploadMimeType(
        filename,
        null,
        'application/octet-stream',
      );
    }
    const originalName = String(att.originalName || filename).trim();
    const size =
      Number.isFinite(att.size) && att.size > 0
        ? Math.floor(Number(att.size))
        : 0;

    return {
      filename,
      mimetype,
      originalName,
      size,
      url,
    };
  });
};

export const uploadPendingChatAttachment = async (
  pending: PendingChatAttachment,
): Promise<ChatMessageAttachmentPayload[]> => {
  if (pending.uploadedAttachments?.length) {
    return pending.uploadedAttachments;
  }

  const uploadRes = await uploadChatFileToServer(pending);
  const attachments = normalizeUploadedAttachments(uploadRes);

  if (!attachments.length) {
    throw new Error('Upload response was invalid');
  }

  return attachments;
};
