import { MatDialog } from '@angular/material';

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  ConfirmDialog,
  UploadSelectorDialog
} from '../../dialogs';

import {
  ChannelMessage,
  ChannelUser,
  Upload
} from '../../models';

@Component({
  selector: 'upload-message',
  templateUrl: 'upload-message.component.html'
})
export class UploadMessageComponent implements OnInit {
  hasPermission = false;
  @Input() message: ChannelMessage;
  @Input() user: ChannelUser;
  @Input() imgSize = 200;
  @Output() edit = new EventEmitter<ChannelMessage>();
  @Output() delete = new EventEmitter<ChannelMessage>();
  @Output() update = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.hasPermission =
      this.user.isAdmin ||
      this.message.userId === this.user.userId;
  }

  viewImage = () => window.open(this.message.value, '_blank');

  editMessage = () =>
    this.dialog
      .open(UploadSelectorDialog, {
        data: this.user.user,
        width: '1920px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((u: Upload) => {
        if (u) {
          let updated = Object.assign(new ChannelMessage, {
            ...this.message,
            uploadId: u.id,
            value: u.url
          });

          this.edit.emit(updated);
        } else {
          this.update.emit();
        }
      });

  deleteMessage = () =>
    this.dialog
      .open(ConfirmDialog)
      .afterClosed()
      .subscribe(res => res && this.delete.emit(this.message));
}
