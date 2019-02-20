import { ChannelMessage } from './channel-message';
import { User } from './user';

export class Upload {
  id: number;
  userId: number;
  url: string;
  path: string;
  file: string;
  name: string;
  uploadDate: Date;

  user: User;

  channelMessages: ChannelMessage[];
}
