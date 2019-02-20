import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ObjectMapService } from './object-map.service';
import { SnackerService } from './snacker.service';

import {
  Channel,
  ChannelMessage,
  ChannelUser,
  User
} from '../models';

@Injectable()
export class ChannelService {
  private channels = new BehaviorSubject<Channel[]>(null);
  private userCreated = new BehaviorSubject<Channel[]>(null);
  private userJoined = new BehaviorSubject<Channel[]>(null);
  private users = new BehaviorSubject<ChannelUser[]>(null);
  private admins = new BehaviorSubject<ChannelUser[]>(null);
  private messages = new BehaviorSubject<ChannelMessage[]>(null);
  private channel = new BehaviorSubject<Channel>(null);
  private channelUser = new BehaviorSubject<ChannelUser>(null);

  channels$ = this.channels.asObservable();
  userCreated$ = this.userCreated.asObservable();
  userJoined$ = this.userJoined.asObservable();
  users$ = this.users.asObservable();
  admins$ = this.admins.asObservable();
  messages$ = this.messages.asObservable();
  channel$ = this.channel.asObservable();
  channelUser$ = this.channelUser.asObservable();

  constructor(
    private http: HttpClient,
    private mapper: ObjectMapService,
    private snacker: SnackerService
  ) { }

  getChannels = () =>
    this.http.get<Channel[]>('/api/channel/getChannels')
      .subscribe(
        data => this.channels.next(data.map(x => this.mapper.mapChannel(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  searchChannels = (search: string) =>
    this.http.get<Channel[]>(`/api/channel/searchChannels/${search}`)
      .subscribe(
        data => this.channels.next(data.map(x => this.mapper.mapChannel(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getUserCreatedChannels = (userId: number) =>
    this.http.get<Channel[]>(`/api/channel/getUserCreatedChannels/${userId}`)
      .subscribe(
        data => this.userCreated.next(data.map(x => this.mapper.mapChannel(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getUserDeletedChannels = (userId: number) =>
    this.http.get<Channel[]>(`/api/channel/getUserDeletedChannels/${userId}`)
      .subscribe(
        data => this.userCreated.next(data.map(x => this.mapper.mapChannel(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getUserJoinedChannels = (userId: number) =>
    this.http.get<Channel[]>(`/api/channel/getUserJoinedChannels/${userId}`)
      .subscribe(
        data => this.userJoined.next(data.map(x => this.mapper.mapChannel(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getChannelUsers = (channelId: number) =>
    this.http.get<ChannelUser[]>(`/api/channel/getChannelUsers/${channelId}`)
      .subscribe(
        data => this.users.next(data.map(x => this.mapper.mapChannelUser(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getChannelAdmins = (channelId: number) =>
    this.http.get<ChannelUser[]>(`/api/channel/getChannelAdmins/${channelId}`)
      .subscribe(
        data => this.admins.next(data.map(x => this.mapper.mapChannelUser(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getChannelMessages = (channelId: number) =>
    this.http.get<ChannelMessage[]>(`/api/channel/getChannelMessages/${channelId}`)
      .subscribe(
        data => this.messages.next(data.map(x => this.mapper.mapChannelMessage(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getChannel = (name: string) =>
    this.http.get<Channel>(`/api/channel/getChannel/${name}`)
      .subscribe(
        data => this.channel.next(this.mapper.mapChannel(data)),
        err => this.snacker.sendErrorMessage(err.error)
      );

  validateChannelName = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<boolean>('/api/channel/validateChannelName', channel)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    });

  addChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/addChannel', channel)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${channel.name} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
    });

  updateChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/updateChannel', channel)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${channel.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  toggleChannelDeleted = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/toggleChannelDeleted', channel)
        .subscribe(
          () => {
            const message = channel.isDeleted ?
              `${channel.name} successfully restored` :
              `${channel.name} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  deleteChannel = (channel: Channel): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/deleteChannel', channel)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${channel.name} successfully deleted permanently`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  syncChannelUser = (user: User, channelName: string) =>
    this.http.post<ChannelUser>(`/api/channel/syncChannelUser/${channelName}`, user)
      .subscribe(
        data => this.channelUser.next(this.mapper.mapChannelUser(data)),
        err => this.snacker.sendErrorMessage(err.error)
      );

  addChannelUser = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/addChannelUser', user)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${user.user.username} successfully joined ${user.channel.name}`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  toggleChannelAdmin = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/toggleChannelAdmin', user)
        .subscribe(
          () => {
            const message = user.isAdmin ?
              `Admin permissions removed from ${user.user.username}` :
              `Admin permissions granted to ${user.user.username}`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  deleteChannelUser = (user: ChannelUser): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/deleteChannelUser', user)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${user.user.username} successfully removed from ${user.channel.name}`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  addChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/addChannelMessage', message)
        .subscribe(
          () => {
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  updateChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/updateChannelMessage', message)
        .subscribe(
          () => {
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });

  deleteChannelMessage = (message: ChannelMessage): Promise<boolean> =>
    new Promise((resolve) =>
    {
      this.http.post('/api/channel/deleteChannelMessage', message)
        .subscribe(
          () => {
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
