import { User } from './user';

export interface Identity {
  authenticated: boolean;
  initialized: boolean;
  user: User;
}
