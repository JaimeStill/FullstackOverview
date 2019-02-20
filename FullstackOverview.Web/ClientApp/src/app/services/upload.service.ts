import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CoreService } from './core.service';
import { ObjectMapService } from './object-map.service';
import { SnackerService } from './snacker.service';
import { Upload } from '../models';

@Injectable()
export class UploadService {
  private uploads = new BehaviorSubject<Upload[]>(null);
  private search = new BehaviorSubject<Upload[]>(null);
  private upload = new BehaviorSubject<Upload>(null);

  uploads$ = this.uploads.asObservable();
  search$ = this.search.asObservable();
  upload$ = this.upload.asObservable();

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private mapper: ObjectMapService,
    private snacker: SnackerService
  ) { }

  getUserUploads = (userId: number) =>
    this.http.get<Upload[]>(`/api/upload/getUserUploads/${userId}`)
      .subscribe(
        data => this.uploads.next(data.map(x => this.mapper.mapUpload(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  searchUploads = (search: string) =>
    this.http.get<Upload[]>(`/api/upload/searchUploads/${search}`)
      .subscribe(
        data => this.search.next(data.map(x => this.mapper.mapUpload(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  clearSearch() {
    this.search.next(null);
  }

  getUpload = (id: number) =>
    this.http.get<Upload>(`/api/upload/getUpload/${id}`)
      .subscribe(
        data => this.upload.next(this.mapper.mapUpload(data)),
        err => this.snacker.sendErrorMessage(err.error)
      );

  uploadFiles = (formData: FormData, userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(
        `/api/upload/uploadFiles/${userId}`,
        formData,
        { headers: this.core.getUploadOptions() }
      )
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage('Uploads successfully processed');
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
    });

  deleteUpload = (upload: Upload): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post('/api/upload/deleteUpload', upload)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${upload.file} successfully deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    });
}
