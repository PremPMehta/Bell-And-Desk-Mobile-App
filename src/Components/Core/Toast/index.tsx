import { Platform, NativeModules } from 'react-native';
import React, { ReactNode } from 'react';
import Toast, { ToastPosition } from 'react-native-toast-message';

const FToast = NativeModules.FToast;

// Y offset constants
const Y_OFFSET_TOP = Platform.select({ ios: 60, android: 40 })!;
const Y_OFFSET_BOTTOM = 140;
const Y_OFFSET_CENTER = 0;

// Color constants
const COLOR_ERROR = '#CC0000';
const COLOR_SUCCESS = '#007E33';
const COLOR_WARNING = '#FF8800';
const COLOR_INFO = '#000000';

// Define the possible toast types for better type safety
type ToastType = 'error' | 'success' | 'info' | 'warning';

// Define the function signature for each toast function
interface ToastOptions {
  msg: string;
}

// Helper function to show toast with a specific type and position
const showToast = (
  type: ToastType,
  position: 'top' | 'bottom' | 'center',
  title: string,
  msg: string,
  color: string,
  topOffset: number,
  bottomOffset: number,
) => {
  Toast.show({
    type,
    position: position as ToastPosition,
    text1: title,
    text2: msg,
    visibilityTime: 4000,
    autoHide: true,
    topOffset,
    bottomOffset,
    style: { backgroundColor: color },
  } as any);
};

const ToastModule = {
  errorTop: ({ msg }: ToastOptions): ReactNode => {
    showToast('error', 'top', 'Error', msg, COLOR_ERROR, 30, 40);
    return <></>;
  },

  errorBottom: ({ msg }: ToastOptions): ReactNode => {
    showToast('error', 'bottom', 'Error', msg, COLOR_ERROR, 30, 40);
    return <></>;
  },

  error: ({ msg }: ToastOptions): ReactNode => {
    showToast('error', 'bottom', 'Error', msg, COLOR_ERROR, 30, 40);
    return <></>;
  },

  showTop: ({ msg }: ToastOptions): ReactNode => {
    showToast('info', 'top', 'Info', msg, COLOR_INFO, Y_OFFSET_TOP, 40);
    return <></>;
  },

  showBottom: ({ msg }: ToastOptions): ReactNode => {
    showToast('info', 'bottom', 'Info', msg, COLOR_INFO, 30, 40);
    return <></>;
  },

  show: ({ msg }: ToastOptions): ReactNode => {
    showToast('info', 'center', 'Info', msg, COLOR_INFO, 30, 40);
    return <></>;
  },

  successTop: ({ msg }: ToastOptions): ReactNode => {
    showToast(
      'success',
      'top',
      'Success',
      msg,
      COLOR_SUCCESS,
      Y_OFFSET_TOP,
      40,
    );
    return <></>;
  },

  successBottom: ({ msg }: ToastOptions): ReactNode => {
    showToast('success', 'bottom', 'Success', msg, COLOR_SUCCESS, 30, 40);
    return <></>;
  },

  success: ({ msg }: ToastOptions): ReactNode => {
    showToast('success', 'center', 'Success', msg, COLOR_SUCCESS, 30, 40);
    return <></>;
  },

  warnTop: ({ msg }: ToastOptions): ReactNode => {
    showToast(
      'warning',
      'top',
      'Warning',
      msg,
      COLOR_WARNING,
      Y_OFFSET_TOP,
      40,
    );
    return <></>;
  },

  warnBottom: ({ msg }: ToastOptions): ReactNode => {
    showToast('warning', 'bottom', 'Warning', msg, COLOR_WARNING, 30, 40);
    return <></>;
  },

  warn: ({ msg }: ToastOptions): ReactNode => {
    showToast('warning', 'center', 'Warning', msg, COLOR_WARNING, 30, 40);
    return <></>;
  },

  exitApp: ({ msg }: ToastOptions): ReactNode => {
    showToast('info', 'bottom', 'Exit App', msg, COLOR_INFO, 30, 40);
    return <></>;
  },
};

export default ToastModule;
