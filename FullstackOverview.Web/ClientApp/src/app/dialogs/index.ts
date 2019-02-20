import { ConfirmDialog } from './confirm.dialog';
import { ChannelDialog } from './channel/channel.dialog';
import { UploadSelectorDialog } from './upload/upload-selector.dialog';
import { UserSettingsDialog } from './user/user-settings.dialog';

export const Dialogs = [
  ChannelDialog,
  ConfirmDialog,
  UploadSelectorDialog,
  UserSettingsDialog
];

export * from './confirm.dialog';
export * from './channel/channel.dialog';
export * from './upload/upload-selector.dialog';
export * from './user/user-settings.dialog';
