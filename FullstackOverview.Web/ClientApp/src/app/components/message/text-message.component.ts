import { MatDialog } from '@angular/material';

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  ConfirmDialog
} from '../../dialogs';

import {
  ChannelMessage,
  ChannelUser
} from '../../models';

@Component({
  selector: 'text-message',
  templateUrl: 'text-message.component.html'
})
export class TextMessageComponent implements OnInit {
  hasPermission = false;
  editing = false;
  update: string;
  @Input() message: ChannelMessage;
  @Input() user: ChannelUser;
  @Output() edit = new EventEmitter<ChannelMessage>();
  @Output() delete = new EventEmitter<ChannelMessage>();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.update = this.message.value;
    this.hasPermission =
      this.user.isAdmin ||
      this.message.userId === this.user.userId;
  }

  toggleEditing() {
    if (this.editing) {
      this.editing = false;
      this.update = this.message.value;
    } else {
      this.editing = true;
    }
  }

  updateMessage() {
    this.message.value = this.update;
    this.edit.emit(this.message);
  }

  deleteMessage = () =>
    this.dialog
      .open(ConfirmDialog)
      .afterClosed()
      .subscribe(res => res && this.delete.emit(this.message));
}
