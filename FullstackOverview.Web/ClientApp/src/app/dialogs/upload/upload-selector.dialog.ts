import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSliderChange
} from '@angular/material';

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import { ConfirmDialog } from '../confirm.dialog';

import {
  CoreService,
  UploadService
} from '../../services';

import {
  Upload,
  User
} from '../../models';

@Component({
  selector: 'upload-selector-dialog',
  templateUrl: 'upload-selector.dialog.html',
  providers: [UploadService]
})
export class UploadSelectorDialog implements OnInit {
  private initialized = false;
  files: File[];
  formData: FormData;
  uploading = false;
  imgSize = 200;

  constructor(
    public core: CoreService,
    public upload: UploadService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    if (!user || !user.id) {
      this.dialogRef.close(null);
    }
  }

  ngOnInit() {
    this.upload.getUserUploads(this.user.id);
  }

  @ViewChild('uploadSearch')
  set uploadSearch(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          val.length > 2 ?
            this.upload.searchUploads(val) :
            this.upload.clearSearch();
        });

      this.initialized = true;
    }
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

  selectUpload = (upload: Upload) => this.dialogRef.close(upload);
}
