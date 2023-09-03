import { Directive, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class UnsubscribeComponent implements OnDestroy {
  unsub$ = new Subject();
  constructor() {}

  ngOnDestroy(): void {
    this.unsub$.next(false);
  }
}
