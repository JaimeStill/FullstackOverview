import { Injectable } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from './snacker.service';

@Injectable()
export class SocketService {
  private connection = new HubConnectionBuilder()
    .withUrl('/channel-socket')
    .build();

  private connected = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<any>(null);
  private trigger = new BehaviorSubject<boolean>(false);

  connected$ = this.connected.asObservable();
  error$ = this.error.asObservable();
  trigger$ = this.trigger.asObservable();

  constructor(
    private snacker: SnackerService
  ) {
    this.connection.on(
      'channelAlert',
      (message: string) => this.snacker.sendColorMessage(message, ['snacker-teal'])
    );

    this.connection.on('channelMessage', () => this.trigger.next(true));

    this.connection
      .start()
      .then(() => this.connected.next(true))
      .catch((err) => {
        this.connected.next(false);
        this.error.next(err);
        this.snacker.sendErrorMessage(err.error);
      });
  }

  triggerJoinChannel = async (group: string) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerJoinChannel', group);
    }
  }

  triggerLeaveChannel = async (group: string) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerLeaveChannel', group);
    }
  }

  triggerChannelMessage = async (group: string) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerChannelMessage', group);
    }
  }
}
