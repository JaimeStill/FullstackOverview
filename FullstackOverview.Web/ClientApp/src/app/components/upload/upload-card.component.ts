import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Upload } from '../../models';

@Component({
  selector: 'upload-card',
  templateUrl: 'upload-card.component.html'
})
export class UploadCardComponent {
  @Input() upload: Upload;
  @Input() height: string;
  @Output() delete = new EventEmitter<Upload>();
  @Output() select = new EventEmitter<Upload>();
}
