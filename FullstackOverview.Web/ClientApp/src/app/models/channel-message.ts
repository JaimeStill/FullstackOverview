import { Channel } from './channel';
import { User } from './user';
import { Upload } from './upload';

export class ChannelMessage {
  id: number;
  channelId: number;
  uploadId: number;
  userId: number;
  value: string;
  isUpload: boolean;
  messageDate: Date;

  channel: Channel;
  upload: Upload;
  user: User;
}
