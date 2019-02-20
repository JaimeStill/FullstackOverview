import {
  Component,
  Input
} from '@angular/core';

import {
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'panel-link',
  templateUrl: 'panel-link.component.html',
  styleUrls: ['panel-link.component.css'],
  animations: [
    trigger(
      'slide', [
        state('collapse', style({
          width: 0,
          opacity: 0
        })),
        state('thin', style({
          width: '100%',
          opacity: 1
        })),
        state('full', style({
          width: '100%',
          opacity: 1
        })),
        transition('collapse => thin', animate('100ms ease-in')),
        transition('thin => full', animate('100ms ease-in')),
        transition('full => collapse', animate('100ms ease-out'))
      ]
    )
  ]
})
export class PanelLinkComponent {
  @Input() link: string;
  @Input() state = 'thin';
  @Input() label = 'Home';
  @Input() tooltipPosition = 'right';
  @Input() icon = 'home';
}
