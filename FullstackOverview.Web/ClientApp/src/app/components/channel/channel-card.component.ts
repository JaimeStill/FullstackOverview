import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Channel
} from '../../models';

@Component({
  selector: 'channel-card',
  templateUrl: 'channel-card.component.html'
})
export class ChannelCardComponent {
  @Input() channel: Channel;
  @Output() view = new EventEmitter<Channel>();
}
