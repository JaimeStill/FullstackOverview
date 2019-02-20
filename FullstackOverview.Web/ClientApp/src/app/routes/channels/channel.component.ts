import { MatSliderChange } from '@angular/material';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ChannelService,
  IdentityService,
  SocketService
} from '../../services';

import {
  Channel,
  ChannelMessage,
  ChannelUser
} from '../../models';

@Component({
  selector: 'channel',
  templateUrl: 'channel.component.html',
  providers: [ChannelService]
})
export class ChannelComponent implements OnInit, OnDestroy {
  channel: Channel;
  message = new ChannelMessage();
  connected = false;
  error: any;
  initialized: boolean;
  sending = false;
  imgSize = 200;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: SocketService,
    public identity: IdentityService,
    public channelService: ChannelService
  ) { }

  private initializeSocket = () => {
    this.socket.connected$.subscribe(status => status && this.initializeChannel());
  }

  private initializeChannel = () => {
    this.route.paramMap.subscribe(val => {
      if (val.has('name')) {
        const name = val.get('name');
        this.channelService.getChannel(name);

        this.identity.identity$.subscribe(auth => {
          this.channelService.syncChannelUser(auth.user, name);
        });

        this.channelService.channel$.subscribe(c => {
          if (c) {
            this.channel = c;
            this.initializeChannelSocket(c);
          }
        });
      } else {
        this.router.navigate(['/channels']);
      }
    });
  }

  private initializeChannelSocket = (c: Channel) => {
    this.channel = c;
    this.channelService.getChannelMessages(c.id);

    if (this.connected && !this.initialized) {
      this.socket.triggerJoinChannel(c.name);
      this.socket.trigger$.subscribe(res => res && this.channelService.getChannelMessages(c.id));
      this.initialized = true;
    }
  }

  private setMessageProperties = (message: ChannelMessage, user: ChannelUser) => {
    message.channelId = this.channel.id;
    message.userId = user.userId;
  }

  ngOnInit() {
    this.socket.connected$.subscribe(status => {
      this.connected = status;

      if (status) {
        this.initializeSocket();
      }
    });
  }

  ngOnDestroy() {
    if (this.connected && this.channel) {
      this.socket.triggerLeaveChannel(this.channel.name);
    }
  }

  setImageSize = (event: MatSliderChange) => this.imgSize = event.value;

  async sendMessage(message: ChannelMessage, user: ChannelUser) {
    this.setMessageProperties(message, user);
    this.sending = true;
    const res = await this.channelService.addChannelMessage(message);
    this.sending = false;
    this.message = new ChannelMessage();
    res && this.socket.triggerChannelMessage(this.channel.name);
  }

  async editMessage(message: ChannelMessage) {
    this.sending = true;
    const res = await this.channelService.updateChannelMessage(message);
    this.sending = false;
    res && this.socket.triggerChannelMessage(this.channel.name);
  }

  async deleteMessage(message: ChannelMessage) {
    this.sending = true;
    const res = await this.channelService.deleteChannelMessage(message);
    this.sending = false;
    res && this.socket.triggerChannelMessage(this.channel.name);
  }
}
