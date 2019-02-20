import { Injectable } from '@angular/core';

import {
  Channel,
  ChannelMessage,
  ChannelUser,
  Upload,
  User
} from '../models';

@Injectable()
export class ObjectMapService {
  // map - Use when receiving response from HTTP request
  // mapPerson = (person: Object): Person => Object.assign(new Person, person);
  mapChannel = (channel: Object): Channel => Object.assign(new Channel, channel);
  mapChannelMessage = (message: Object): ChannelMessage => Object.assign(new ChannelMessage, message);
  mapChannelUser = (user: Object): ChannelUser => Object.assign(new ChannelUser, user);
  mapUpload = (upload: Object): Upload => Object.assign(new Upload, upload);
  mapUser = (user: Object): User => Object.assign(new User, user);

  // compareWith - Use when binding object value to MatSelect
  // comparePeople = (p1: Person, p2: Person) => p1 && p2 ? p1.id === p2.id : false;
  compareChannels = (c1: Channel, c2: Channel): boolean => c1 && c2 ? c1.id === c2.id : false;
  compareChannelMessages = (m1: ChannelMessage, m2: ChannelMessage): boolean => m1 && m2 ? m1.id === m2.id : false;
  compareChannelUsers = (u1: ChannelUser, u2: ChannelUser): boolean => u1 && u2 ? u1.id === u2.id : false;
  compareUploads = (u1: Upload, u2: Upload): boolean => u1 && u2 ? u1.id === u2.id : false;
  compareUsers = (u1: User, u2: User): boolean => u1 && u2 ? u1.id === u2.id : false;

  // trackBy - Use when iterating collection with NgFor
  // trackByPerson = (person: Person) => person.id;
  trackByChannel = (channel: Channel): number => channel.id;
  trackByChannelMessage = (message: ChannelMessage): number => message.id;
  trackByChannelUser = (user: ChannelUser): number => user.id;
  tracckByUpload = (upload: Upload): number => upload.id;
  trackByUser = (user: User): number => user.id;
}
