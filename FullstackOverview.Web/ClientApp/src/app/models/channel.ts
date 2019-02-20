import { ChannelMessage } from './channel-message';
import { ChannelUser } from './channel-user';
import { User } from './user';

export class Channel {
  id: number;
  userId: number;
  name: string;
  description: string;
  createdDate: Date;
  isDeleted: boolean;

  user: User;

  channelMessages: ChannelMessage[];
  channelUsers: ChannelUser[];
}
