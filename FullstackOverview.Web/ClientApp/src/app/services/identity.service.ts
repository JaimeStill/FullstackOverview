import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ObjectMapService } from './object-map.service';
import { SnackerService } from './snacker.service';
import { Identity, User } from '../models';

@Injectable()
export class IdentityService {
  private authUrl: string;
  private identity = new BehaviorSubject<Identity>({ authenticated: null, initialized: false, user: null });
  private users = new BehaviorSubject<User[]>(null);
  private search = new BehaviorSubject<User[]>(null);
  private user = new BehaviorSubject<User>(null);

  identity$ = this.identity.asObservable();
  users$ = this.users.asObservable();
  search$ = this.search.asObservable();
  user$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private mapper: ObjectMapService,
    private snacker: SnackerService
  ) {
    this.authUrl = `${window.location.protocol}//${window.location.host}/auth/`;
  }

  registerNavigationHistory = () => window.history.pushState({}, '', window.location.href);

  authenticateUser = () => {
    this.registerNavigationHistory();
    window.location.href = `${this.authUrl}login`;
  }

  logout = () => {
    this.registerNavigationHistory();
    window.location.href = `${this.authUrl}logout`;
  }

  checkAuthentication = () =>
    this.http.get<boolean>('/api/identity/checkAuthentication')
      .subscribe(
        data => this.identity.next({ ...this.identity.value, authenticated: data }),
        err => this.snacker.sendErrorMessage(err.error)
      );

  syncUser = () =>
    this.http.get<User>('/api/identity/syncUser')
      .subscribe(
        data => this.identity.next({ ...this.identity.value, initialized: true, user: this.mapper.mapUser(data) }),

        err => this.snacker.sendErrorMessage(err.error)
      );

  getUsers = () =>
    this.http.get<User[]>('/api/identity/getUsers')
      .subscribe(
        data => this.users.next(data.map(x => this.mapper.mapUser(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  searchUsers = (search: string) =>
    this.http.get<User[]>(`/api/identity/searchUsers/${search}`)
      .subscribe(
        data => this.search.next(data.map(x => this.mapper.mapUser(x))),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getUser = (id: number) =>
    this.http.get<User>(`/api/identity/getUser/${id}`)
      .subscribe(
        data => this.user.next(this.mapper.mapUser(data)),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getUserByToken = (token: string) =>
    this.http.get<User>(`/api/identity/getUserByToken/${token}`)
      .subscribe(
        data => this.user.next(this.mapper.mapUser(data)),
        err => this.snacker.sendErrorMessage(err.error)
      );

  validateUsername = (user: User): Promise<boolean> =>
    new Promise((resolve) =>
      this.http.post<boolean>('/api/identity/validateUsername', user)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    );

  updateUser = (user: User): Promise<boolean> =>
    new Promise((resolve) =>
      this.http.post('/api/identity/updateUser', user)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${user.username} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        )
    );
}
