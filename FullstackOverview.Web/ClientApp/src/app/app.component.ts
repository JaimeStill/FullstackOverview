import { MatDialog } from '@angular/material';
import { UserSettingsDialog } from './dialogs';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  IdentityService,
  SidepanelService,
  ThemeService
} from './services';

import {
  Identity,
  Theme,
  User
} from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  themeClass = 'default';
  authentication: Identity;

  constructor(
    private dialog: MatDialog,
    public sidepanel: SidepanelService,
    public theme: ThemeService,
    public identity: IdentityService
  ) { }

  ngOnInit() {
    this.identity.checkAuthentication();

    this.identity.identity$.subscribe(auth => {
      if (auth.authenticated != null) {
        this.authentication = auth;
        this.handleAuthentication();
      }
    });

    this.theme.theme$.subscribe((t: Theme) => this.themeClass = t.name);
  }

  viewSettings = () =>
    this.dialog.open(UserSettingsDialog, {
      data: Object.assign(new User, this.authentication.user),
      width: '600px'
    })
    .afterClosed()
    .subscribe((res: boolean) => res && this.identity.syncUser());

  private handleAuthentication = () => {
    if (this.authentication.authenticated === false) {
      this.identity.authenticateUser();
    } else if (this.authentication.authenticated && !this.authentication.initialized) {
      this.identity.syncUser();
    }
  }
}
