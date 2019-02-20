import { Channel } from './channel';
import { ChannelMessage } from './channel-message';
import { ChannelUser } from './channel-user';
import { Upload } from './upload';

export class User {
  id: number;
  token: string;
  email: string;
  username: string;
  sidepanel: string;
  theme: string;

  channels: Channel[];
  channelMessages: ChannelMessage[];
  uploads: Upload[];
  userChannels: ChannelUser[];
}
