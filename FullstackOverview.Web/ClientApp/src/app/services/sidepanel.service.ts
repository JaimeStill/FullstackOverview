import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IdentityService } from './identity.service';

@Injectable()
export class SidepanelService {
  private stateValues: string[] = [
    'collapse',
    'thin',
    'full'
  ];

  private states = new BehaviorSubject<string[]>(this.stateValues);
  private state = new BehaviorSubject<string>(this.states.value[1]);

  states$ = this.states.asObservable();
  state$ = this.state.asObservable();

  constructor(
    private identity: IdentityService
  ) {
    identity.identity$.subscribe(auth => {
      if (auth.user != null) {
        this.state.next(auth.user.sidepanel);
      }
    })
  }

  toggleState() {
    const index = this.stateValues.indexOf(this.state.value);

    index === this.stateValues.length - 1 ?
      this.state.next(this.stateValues[0]) :
      this.state.next(this.stateValues[index + 1]);
  }

  setState = (s: string) => this.state.next(s);
}
