import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ChannelDialog } from '../../dialogs';
import { Channel } from '../../models';

import {
  ChannelService,
  CoreService,
  IdentityService
} from '../../services';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'channels',
  templateUrl: 'channels.component.html',
  providers: [ChannelService]
})
export class ChannelsComponent implements OnInit {
  initialized = false;
  newChannel = new Channel();

  constructor(
    private core: CoreService,
    private dialog: MatDialog,
    private router: Router,
    public channelService: ChannelService,
    public identity: IdentityService
  ) { }

  @ViewChild('channelSearch')
  set channelSearch(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          val.length > 0 ?
            this.channelService.searchChannels(val) :
            this.channelService.getChannels();
        });

      this.initialized = true;
    }
  }

  ngOnInit() {
    this.channelService.getChannels();
  }

  addChannel = (userId: number) => {
    this.newChannel.userId = userId;
    this.dialog.open(ChannelDialog, {
      data: this.newChannel,
      width: '600px'
    })
    .afterClosed()
    .subscribe((res: boolean) => res && this.channelService.getChannels());
  }

  viewChannel(channel: Channel) {
    this.router.navigate(['/channel', channel.name]);
  }
}
