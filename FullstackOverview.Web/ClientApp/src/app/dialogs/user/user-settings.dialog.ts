import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSelectChange
} from '@angular/material';

import {
  Component,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  CoreService,
  IdentityService,
  SidepanelService,
  ThemeService
} from '../../services';

import {
  Theme,
  User
} from '../../models';

@Component({
  selector: 'user-settings-dialog',
  templateUrl: 'user-settings.dialog.html'
})
export class UserSettingsDialog {
  private initialized = false;
  validUsername = true;

  constructor(
    public core: CoreService,
    public identity: IdentityService,
    public sidepanel: SidepanelService,
    public themer: ThemeService,
    public dialogRef: MatDialogRef<UserSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }

  @ViewChild('userInput')
  set userInput(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          this.user.username = this.core.urlEncode(val);
          this.validUsername = await this.identity.validateUsername(this.user);
        });
      this.initialized = true;
    }
  }

  toggleTheme = (event: MatSelectChange, themes: Theme[]) => {
    this.themer.setTheme(themes.find(t => t.name === event.value));
  }

  toggleSidepanel = (event: MatSelectChange) => {
    this.sidepanel.setState(event.value);
  }

  updateUser = async () => await this.identity.updateUser(this.user) && this.dialogRef.close(true);
}
