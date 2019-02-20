import { Component } from '@angular/core';
import { ConfirmDialog } from '../../dialogs';

import {
  MatDialog,
  MatSliderChange
} from '@angular/material';

import {
  IdentityService,
  UploadService
} from '../../services';

import {
  Upload,
  User
} from '../../models';

@Component({
  selector: 'uploads',
  templateUrl: 'uploads.component.html',
  providers: [UploadService]
})
export class UploadsComponent {
  user: User;
  files: File[];
  formData: FormData;
  uploading = false;
  imgSize = 240;

  constructor(
    private dialog: MatDialog,
    public identity: IdentityService,
    public upload: UploadService
  ) { }

  ngOnInit() {
    this.identity.identity$.subscribe(auth => {
      if (auth.user) {
        this.user = auth.user;
        this.upload.getUserUploads(this.user.id);
      }
    });
  }

  setImageSize = (event: MatSliderChange) => this.imgSize = event.value;

  fileChange(fileDetails: [File[], FormData]) {
    this.files = fileDetails[0];
    this.formData = fileDetails[1];
  }

  clearFiles() {
    this.files = null;
    this.formData = null;
  }

  async uploadFiles() {
    this.uploading = true;
    const res = await this.upload.uploadFiles(this.formData, this.user.id);
    this.uploading = false;
    this.clearFiles();
    res && this.upload.getUserUploads(this.user.id);
  }

  openUpload = (u: Upload) => window.open(u.url, 'blank');

  async deleteUpload(u: Upload) {
    await this.dialog
      .open(ConfirmDialog)
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          const res = await this.upload.deleteUpload(u);
          res && this.upload.getUserUploads(this.user.id);
        }
      });
  }
}
